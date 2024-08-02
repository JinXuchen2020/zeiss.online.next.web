import { ContainerOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Modal, Space, Upload, UploadProps } from "antd"
import { FunctionComponent, useEffect, useState } from "react";
import { ICourseRspModel, IQuestionRspModel} from "models";
import { ExamService, CourseService} from 'services';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { ExamTable } from "components";
import fileDownload from "js-file-download";

export const ExamInfo : FunctionComponent<{currentCourse: ICourseRspModel | undefined, updateQuestion: any}> = ({currentCourse, updateQuestion}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [questions, setQuestions] = useState<IQuestionRspModel[]>();

  const [allQuestions, setAllQuestions] = useState<IQuestionRspModel[]>();

  const [selectedQuestions, setSelectedQuestions] = useState<IQuestionRspModel[]>();

  const examService = ExamService;
  const courseService = CourseService;

  const handleExportTemplate = async ()=> 
  {
    let templateData = selectedQuestions ?? []
    examService.downloadTemplate(templateData).then(rsp=>{
      if(rsp){
        fileDownload(rsp, "QuestionTemplate.xlsx");
      }        
    });
  }

  const handleSelectedExams = (selectQuestions: IQuestionRspModel[])=> 
  {
    if(currentCourse){
      let currentQuestions = questions;
      if(currentQuestions){
        if(selectedQuestions) {
          selectedQuestions.forEach((c, index)=> {
            if(!selectQuestions.find(t=>t.id === c.id)){
              selectedQuestions.splice(index, 1);
              setSelectedQuestions([...selectedQuestions]);
            }
          });
        }

        currentQuestions.forEach((c, index)=> {
          if(!selectQuestions.find(t=>t.id === c.id)){
            currentQuestions?.splice(index, 1);
          }
        });
        
        selectQuestions.forEach(c=>{
          if(!currentQuestions?.find(t=>t.id === c.id)){
            currentQuestions?.push(c);
          }
        });
      }
      else {
        currentQuestions = [...selectQuestions];
      }      
      
      setQuestions([...currentQuestions]);
    }
  }

  const handleSelectedQuestions = async (selectedQuestions: IQuestionRspModel[])=> 
  {
    if(selectedQuestions) {
      setSelectedQuestions([...selectedQuestions]);
    }        
  }   

  const handleImport = (options: RcCustomRequestOptions)=> 
  {
    if(currentCourse){
      const { file } = options;
      let fileData = new FormData();
      fileData.append("file", file);

      if(currentCourse.id) {
        courseService.importCourseQuestions(fileData, currentCourse.id).then(() => {
          courseService.getCourseQuestions(currentCourse.id!).then((rsp) => {
            if(rsp && rsp instanceof Array) {
              setQuestions(rsp)
            }
          });
        });
      }
      else {
        examService.importQuestions(fileData).then((rsp) => {
          if(rsp && rsp instanceof Array) {
            let newQuestions = rsp;
            if(questions) {
              newQuestions = [...questions, ...rsp]
            }

            setQuestions(newQuestions)
            updateQuestion(newQuestions)
          }
        })
      }      
    }    
  }
  
  const showModal = () => {
    setIsModalVisible(true);
    examService.getQuestions({}).then(rsp => setAllQuestions(rsp.data));
  }

  const handleCancel = async () => {
    setIsModalVisible(false);
    if(currentCourse && questions) {
      if(currentCourse.id) {
        await courseService.postCourseQuestions(currentCourse.id!, questions.map(c => c.id!));
      }
      else {
        updateQuestion(questions)
      }
    }    
  };

  const handleDelete = (question: IQuestionRspModel) => {
    if(currentCourse && questions) {
      if(currentCourse.id) {
        courseService.deleteCourseQuestion(currentCourse.id, question.id!).then(()=>{
          courseService.getCourseQuestions(currentCourse.id!).then((rsp) => {
            if(rsp && rsp instanceof Array) {
              setQuestions(rsp)
            }
          });
        });
      }
      else {
        const leftQuestions = questions.filter(c=>c.id !== question.id)
        updateQuestion(leftQuestions)
      }
    }    
  };

  const props : UploadProps = {
    customRequest: handleImport,
    showUploadList: false
  };

  useEffect(() => {
    if(currentCourse) {
      if(currentCourse.id) {
        courseService.getCourseQuestions(currentCourse.id).then((rsp) => {
          if(rsp && rsp instanceof Array) {
            setQuestions(rsp)
          }
        });
      }
      else {
        setQuestions(currentCourse.questions)
      }
    }
  }, [courseService, currentCourse]);

  return (
    <>
      <Space>
        <Button type="text" icon={ <DownloadOutlined /> } onClick={handleExportTemplate}>模板下载</Button>
        <Upload {...props}>
          <Button type="text" icon={ <UploadOutlined /> } >习题导入</Button>
        </Upload>
        <Button type="text" icon={ <ContainerOutlined /> } onClick={showModal}>试题选择</Button>
      </Space>
      <ExamTable 
        loading={false} 
        originQuestions={questions} 
        originSelectedQuestions={selectedQuestions} 
        isEditable={false} 
        isInDialog={false} 
        handleSelect={handleSelectedQuestions} 
        handleDelete={handleDelete} />
      
      <Modal title={'选择试题'} footer={(<Button onClick={handleCancel} type="primary">返回</Button>)} visible={isModalVisible} onCancel={handleCancel}>
        <ExamTable 
          loading={false} 
          originQuestions={allQuestions} 
          originSelectedQuestions={questions} 
          isEditable={false} 
          isInDialog={true} 
          handleSelect={handleSelectedExams} 
          handleDelete={undefined} />
      </Modal>
    </>
  )
}
