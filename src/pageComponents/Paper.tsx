import { Button, Col, Input, InputNumber, InputRef, Row, Select, Space, Tooltip, Upload } from 'antd';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { IPaperRspModel, IQuestionRspModel, IQuestionGroupRspModel, IQuestionOptionRspModel } from "../models";
import { PaperService } from "../services";
import { ConfirmModal, QuestionForm, QuestionGroup } from 'components';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import fileDownload from 'js-file-download';

export const Paper : FunctionComponent<{currentPaper: IPaperRspModel | undefined, update: any, save: any, isPublished?: boolean, handleDeleteItem?: any}> 
= ({currentPaper, update, save, isPublished, handleDeleteItem}) => {
  const [showQuestion, setShowQuestion] = useState(false);

  const [questionModel, setQuestionModel] = useState<IQuestionRspModel>();

  const [questionGroupModel, setQuestionGroupModel] = useState<IQuestionGroupRspModel>()

  const [previousGroupModel, setPreviousGroupModel] = useState<IQuestionGroupRspModel>()

  const [questionIndex, setQuestionIndex] = useState<number>(-1);

  const [questionFormLocation, setQuestionFormLocation] = useState<number>()

  const inputRef = useRef<InputRef>(null);

  const questionGroup = questionGroupModel!;

  const isEdit = false

  const setQuestionGroup = (props: Partial<IQuestionGroupRspModel>) => {
    setQuestionGroupModel({ ...questionGroup, ...props });
  }

  const question = questionModel!;

  const setQuestion = (questionProps: Partial<IQuestionRspModel>) => {
    setQuestionModel({ ...question, ...questionProps });
  }

  const handleSubmit = async () => {
    save()
  };

  const handleQuestionManage = (question: IQuestionRspModel) => {
    setShowQuestion(true);
    setQuestionModel(JSON.parse(JSON.stringify(question)));
    if(question.id) {
      const questionIndex = questionGroup.questions.findIndex(c=>c.id === question.id);
      setQuestionIndex(questionIndex)
    }
    else {
      const questionIndex = questionGroup.questions.findIndex(c=>c.stem === question.stem);
      setQuestionIndex(questionIndex)
    }

    const scrollTop = sessionStorage.getItem("scrollTop");
    setQuestionFormLocation(scrollTop ? parseInt(scrollTop) : 0)
  }

  const handleGroupChange = (newGroup: IQuestionGroupRspModel) => {
    setPreviousGroupModel(JSON.parse(JSON.stringify(questionGroupModel)));
    setQuestionGroupModel(JSON.parse(JSON.stringify(newGroup)));
    setQuestion({questionGroupId: newGroup.id})
  }

  const handleGroupSelect = (value: string) => {
    const group = currentPaper?.questionGroups.find(c=>c.name === value)
    setQuestionGroupModel(group);
  }

  const handleQuestionSave = (deleteOptions: IQuestionOptionRspModel[], isSave: boolean) => {
    if (isSave) {
      if (currentPaper && questionModel && questionGroupModel) {
        deleteOptions.forEach(c => handleDeleteItem(c))
        const questionGroups = currentPaper.questionGroups;
        const groupIndex = questionGroups.findIndex(c => c.name === questionGroupModel.name)
        if (questionIndex === -1) {
          questionGroupModel.questions.push(questionModel)
          questionGroups[groupIndex] = questionGroupModel
        }
        else {
          if (previousGroupModel) {            
            const previousGroupIndex = questionGroups.findIndex(c => c.name === previousGroupModel.name)
            
            previousGroupModel.questions.splice(questionIndex, 1)
            previousGroupModel.selectedQuestionNumber = 0
            questionGroups[previousGroupIndex] = previousGroupModel

            questionGroupModel.questions.push(questionModel)
            questionGroups[groupIndex] = questionGroupModel
          }
          else {
            questionGroupModel.questions[questionIndex] = questionModel
            questionGroups[groupIndex] = questionGroupModel
          }
        }

        update({questionGroups: questionGroups})
        setShowQuestion(false);
      }
    }
    else {
      setShowQuestion(false);
    }    
  }

  const handleQuestionDelete = () => {
    if (currentPaper && questionModel && questionGroupModel) {
      ConfirmModal({
        title: `确定删除试题 ${questionModel.stem}`, 
        confirm: () => {
          const questionGroups = currentPaper.questionGroups;
          const questions = questionGroupModel.questions;
          const questionIndex = questions.findIndex(c=>c.stem === questionModel.stem);
          if (questionIndex >= 0) {
            questions.splice(questionIndex, 1);
            if (questionGroupModel.selectedQuestionNumber > questions.length) {
              questionGroupModel.selectedQuestionNumber = questions.length
            }
            
            const groupIndex = questionGroups.findIndex(c => c.name === questionGroupModel.name)
            questionGroups[groupIndex] = questionGroupModel
          }

          if(previousGroupModel) {
            const questions = previousGroupModel.questions;
            const index = questions.findIndex(c=>c.stem === questionModel.stem);
            if(index >= 0) {
              questions.splice(index, 1); 
              if(previousGroupModel.selectedQuestionNumber > questions.length) {
                previousGroupModel.selectedQuestionNumber = questions.length
              }
              const groupIndex = questionGroups.findIndex(c => c.name === previousGroupModel.name)
              questionGroups[groupIndex] = previousGroupModel
            }
          }

          // eslint-disable-next-line no-eval
          const totalQuestionNumber = eval(questionGroups.map(c=>c.selectedQuestionNumber).join("+")) as number
          let passedQuestionNumber = currentPaper.passedQuestionNumber
          if(passedQuestionNumber > totalQuestionNumber) {
            passedQuestionNumber = totalQuestionNumber
          }
          update({questionGroups: questionGroups, totalQuestionNumber: totalQuestionNumber, passedQuestionNumber: passedQuestionNumber})
          handleDeleteItem(questionModel)
          setQuestionModel(undefined)
          setShowQuestion(false);
        }
      })
    }    
  }

  const handleGroupSave = (newValue: Partial<IQuestionGroupRspModel>) => {
    if(currentPaper && questionGroupModel) {
      const newGroup = {...questionGroupModel, ...newValue}
      const questionGroups = currentPaper.questionGroups;
      if (questionGroupModel.name !== newGroup.name && questionGroups.findIndex(c => c.name === newGroup.name) !== -1) {
        ConfirmModal({
          title: "试题组名已存在"
        })
      }
      else {
        const index = questionGroups.findIndex(c=>c.name === questionGroupModel.name);
        questionGroups[index] = newGroup;                
        
        // eslint-disable-next-line no-eval
        const totalQuestionNumber = eval(questionGroups.map(c=>c.selectedQuestionNumber).join("+")) as number
        update({questionGroups: questionGroups, totalQuestionNumber: totalQuestionNumber})
        setQuestionGroup(newValue)
      }      
    }
  }

  const handleAddGroupConfirm = () => {
    ConfirmModal({
      title: "新建题目组", 
      confirm: () => handleAddGroup(inputRef?.current?.input?.value),
      content: (
        <Row>
          <Col span={6} style={{marginTop: 4}}>
            题目组名: 
          </Col>
          <Col span={16}>
            <Input ref={inputRef} />
          </Col>
        </Row>
      )
    })
  }

  const handleAddGroup = (groupName: string | undefined) => {
    if(currentPaper && groupName && groupName.length > 0) {
      const newGroup : IQuestionGroupRspModel = {
        name: groupName,
        paperId: currentPaper.id,
        questions: [],
        selectedQuestionNumber: 0
      }

      const groups = currentPaper.questionGroups;
      if (groups.findIndex(c=>c.name === newGroup.name) === -1) {
        groups.push(newGroup);
        update({questionGroups: [...groups]})
        setQuestionGroupModel(newGroup)
      }
      else {
        ConfirmModal({
          title: "试题组名已存在"
        })
      }
    }
  }

  const handleDeleteGroup = () => {
    if(questionGroupModel && currentPaper && currentPaper.questionGroups) {
      ConfirmModal({
        title: `确定删除题目组 ${questionGroupModel.name}`, 
        confirm: () => {
          const groups = currentPaper.questionGroups;
          const index = groups.findIndex(c=>c.name === questionGroupModel.name);
          groups.splice(index, 1);

          // eslint-disable-next-line no-eval
          const totalQuestionNumber = eval(groups.map(c=>c.selectedQuestionNumber).join("+")) as number
          let passedQuestionNumber = currentPaper.passedQuestionNumber
          if(passedQuestionNumber > totalQuestionNumber) {
            passedQuestionNumber = totalQuestionNumber
          }
          update({questionGroups: [...groups], totalQuestionNumber: totalQuestionNumber, passedQuestionNumber: passedQuestionNumber})
          handleDeleteItem(questionGroupModel)
          setQuestionGroupModel(undefined)
        }
      })
    }
  }

  const handleDownload = () => {
    PaperService.downloadQuestions(currentPaper?.id).then(rsp => {
      if(rsp) {
        fileDownload(rsp, "试题模板.xlsx");
      }
    })
  }

  const handleImportConfirm = (options: any) => {
    ConfirmModal({
      title: "是否覆盖原有课程？",
      confirm: () => handleImport(options, true),
      cancel: () => handleImport(options, false),
      okText: "是",
      cancelText: "否"
    })
  }

  const handleImport = (options: any, isCover: boolean)=> 
  {
    PaperService.setErrorHandler((err) => {
      ConfirmModal({
        title: <Tooltip title={JSON.stringify(err)}>试题组导入失败</Tooltip>, 
      })
    });
    const { file } = options;
    let fileData = new FormData();
    fileData.append("file", file);

    PaperService.importQuestions(fileData).then((rsp) => {
      if(rsp && rsp instanceof Array) {
        let groupCount = rsp.length;

        // eslint-disable-next-line no-eval
        let questionCount = eval(rsp.map(c=>c.questions.length).join("+")) as number
        if(currentPaper?.questionGroups && currentPaper.questionGroups.length > 0) {
          rsp.forEach(group => {
            const index = currentPaper.questionGroups.findIndex(c=>c.name === group.name)
            if(index >= 0) {
              if(isCover) {
                const currentGroup = currentPaper.questionGroups[index];
                group.questions.forEach(question => {
                  const index = currentGroup.questions.findIndex(c=>c.stem === question.stem)
                  if(index >= 0) {
                    const currentQuestion = currentGroup.questions[index]
                    question.questionOptions.forEach(option => {
                      const index = currentQuestion.questionOptions.findIndex(c=>c.optionContent === option.optionContent)
                      if(index >= 0) {
                        const currentOption = currentQuestion.questionOptions[index]
                        currentQuestion.questionOptions[index] = {...currentOption, isAnswer: option.isAnswer}
                      }
                      else {
                        currentQuestion.questionOptions.push(option)
                      }
                    })
  
                    currentGroup.questions[index] = {...currentQuestion, type: question.type, level: question.level}
                    questionCount--
                  }
                  else {
                    currentGroup.questions.push(question)
                  }
                })
  
                currentPaper.questionGroups[index] = {...currentGroup, selectedQuestionNumber: group.selectedQuestionNumber }
                groupCount--
              }
              else {
                group.name = group.name + "-新"
                currentPaper.questionGroups.push(group)
              }                
            }
            else {
              currentPaper.questionGroups.push(group)
            }
          })          

          // eslint-disable-next-line no-eval
          const totalQuestionNumber = eval(currentPaper.questionGroups.map(c=>c.selectedQuestionNumber).join("+")) as number
          update({questionGroups: [...currentPaper.questionGroups], totalQuestionNumber: totalQuestionNumber})
        }
        else {
          // eslint-disable-next-line no-eval
          const totalQuestionNumber = eval(rsp.map(c=>c.selectedQuestionNumber).join("+")) as number
          update({questionGroups: [...rsp], totalQuestionNumber: totalQuestionNumber})
        }

        ConfirmModal({
          title: `试题组导入成功, 新增试题组${groupCount}个，新增试题${questionCount}个`
        })
      }
    });
  }

  useEffect(() => {
    if(questionGroupModel === undefined && currentPaper?.questionGroups && currentPaper.questionGroups.length > 0) {
      const firstGroup = currentPaper.questionGroups[0];
      setQuestionGroupModel(firstGroup)
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPaper?.questionGroups]);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} md={18}>
          <Row hidden={isPublished} gutter={24} style={{marginBottom: 10}}>
            <Col span={24}>
              <Space style={{float:'right'}}>
                <Button size='small' type="primary" onClick={handleDownload}>导出模板</Button>
                <Upload accept='.xlsx,.xls' customRequest={handleImportConfirm} showUploadList={false}>                  
                  <Button size='small' type="primary">导入试题</Button>
                </Upload>
              </Space>
            </Col>
          </Row>
          {
            questionGroupModel && 
            <Row gutter={24} key={questionGroupModel.id ?? questionGroupModel.name}>
              <Col span={23} offset={1}>
                <QuestionGroup currentQuestionGroup={questionGroupModel} disabled={isPublished} manage={handleQuestionManage} update={handleGroupSave} />
              </Col>
            </Row>
          }          
          <Row gutter={24}>
            <Col id="group" span={23} offset={1}>
              <div style={{float: 'right', minWidth: "200", width: "20%"}}>
                <Select
                  size='small'
                  onChange={(value) => handleGroupSelect(value)}
                  getPopupContainer={()=> document.getElementById("group")!}
                  value={questionGroupModel?.name}
                  style={{width: "100%"}}
                >
                  {currentPaper && currentPaper.questionGroups.map((item, index) => (
                    <Select.Option key={index} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
          <Row hidden={isPublished} gutter={24} style={{marginTop: 10}}>
            <Col span={24}>
              <Space style={{float: 'right'}}>                
                <Button size='small' type='primary' icon={<PlusOutlined />} onClick={handleAddGroupConfirm}>题目组</Button>
                <Button size='small' type='primary' icon={<MinusOutlined />} onClick={handleDeleteGroup}>题目组</Button>
              </Space>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={18} offset={1}>
              {
                currentPaper && (
                  <Space direction="vertical">
                    <label>每次测试会出现{currentPaper.totalQuestionNumber}题</label>
                    <div>答对 <InputNumber 
                      style={{width: 50}} 
                      disabled={isPublished}
                      size='small' 
                      min={0}
                      keyboard={true}
                      max={currentPaper.totalQuestionNumber} 
                      value={currentPaper.passedQuestionNumber} 
                      onChange={(value) => update({passedQuestionNumber: value})} 
                      /> 题 通过测试
                    </div>
                  </Space>
                )
              }
            </Col>
          </Row>
          <Row hidden={isPublished} gutter={24}>
            <Col span={24}>
              <Space style={{float: 'right'}}>                
                <Button type='primary' onClick={()=> handleSubmit()}>保存</Button>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col xs={0} md={6} hidden={!showQuestion} style={{position:'relative'}}>
          <div style={{top: questionFormLocation, position: "absolute", width: '90%' }}>
            <QuestionForm
              currentQuestionGroup={questionGroupModel}
              currentQuestion={questionModel}
              isEdit={isEdit}
              update={setQuestion}
              changeGroup={handleGroupChange}
              save={handleQuestionSave}
              handleDelete={handleQuestionDelete}
              questionGroups={currentPaper?.questionGroups}
              disabled={isPublished} />
          </div>          
        </Col>
        <Col xs={6} md={0} hidden={!showQuestion}>
          <div className='ant-modal-mask'>
            <div className='ant-modal-wrap ant-modal-centered'>
              <div className='ant-modal' style={{width: 520}}>
                <div className='ant-modal-content'>
                  <div className='ant-modal-body'>
                    <QuestionForm
                      currentQuestionGroup={questionGroupModel}
                      currentQuestion={questionModel}
                      isEdit={isEdit}
                      update={setQuestion}
                      changeGroup={handleGroupChange}
                      save={handleQuestionSave} 
                      handleDelete={handleQuestionDelete}
                      disabled={isPublished}
                      questionGroups={currentPaper?.questionGroups} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}
