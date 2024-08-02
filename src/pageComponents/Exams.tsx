import { Button, Space, Upload, UploadProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IQuestionRspModel, IQuestionQueryOption } from 'models';
import { ExamService } from 'services';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { ExamTable } from 'components';
import queryString from 'query-string';
import fileDownload from 'js-file-download';

export const Exams : React.FunctionComponent = () => {
    let navigate = useNavigate();
    let [searchParams] = useSearchParams();

    const currentService = ExamService;

    const [questions, setQuestions] = useState<IQuestionRspModel[]>();
    const [isLoading, setIsLoading] = useState(false);

    const [selectedQuestions, setSelectedQuestions] = useState<IQuestionRspModel[]>();

    const handleCreate = ()=> 
    {
      navigate("/exams/manage");
    }

    const handleExportTemplate = async ()=> 
    {
      let templateData = selectedQuestions ?? []
      currentService.downloadTemplate(templateData).then(rsp=>{
        if(rsp){
          fileDownload(rsp, "习题模板.xlsx");
        }        
      });
    }

    const handleImport = (options: RcCustomRequestOptions)=> 
    {
      const { file } = options;
      let fileData = new FormData();
      fileData.append("file", file);

      currentService.importQuestions(fileData).then(() => {
        refreshPage();
      });
    }
    
    const refreshPage =() =>{
      setIsLoading(true);
      currentService.getQuestions({}).then(rsp => {
        setQuestions([...rsp.data]);
        setSelectedQuestions(undefined);
        setIsLoading(false);
      });      
    }

    const props : UploadProps = {
      customRequest: handleImport,
      showUploadList: false
    };

    const handleDelete = (question: IQuestionRspModel) => {
      currentService.deleteQuestion(question.id!).then(()=>{
        refreshPage();
      });    
    };

    useEffect(() => {
      const query: Partial<IQuestionQueryOption> = queryString.parse(searchParams.toString())
      setIsLoading(true);
      currentService.getQuestions(query).then(rsp => {
        setQuestions(rsp.data)
        setIsLoading(false);
      });
    }, [currentService, searchParams]);

    return (
      <>
        <Space style={{marginBottom: 30, float: 'right'}}>
          <Button type="primary" onClick={handleCreate} >创建试题</Button>
          <Button type="default" onClick={handleExportTemplate}>模板导出</Button>
          <Upload {...props}>
            <Button type="default">习题导入</Button>
          </Upload>
        </Space>
        <ExamTable 
          loading={isLoading} 
          originQuestions={questions} 
          originSelectedQuestions={selectedQuestions} 
          isEditable={true} 
          isInDialog={false} 
          handleSelect={setSelectedQuestions} 
          handleDelete={handleDelete} />
      </>
    );
}
