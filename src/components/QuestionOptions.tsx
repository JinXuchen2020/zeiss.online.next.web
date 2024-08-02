import { Button, Checkbox, Input, Radio, Space } from 'antd';
import React, { FunctionComponent } from 'react';
import { IQuestionOptionRspModel, IQuestionRspModel } from "../models";

export const QuestionOptions : FunctionComponent<{currentQuestion: IQuestionRspModel | undefined, update: any, handleDeleteItem?: any, disabled?: boolean}> 
= ({currentQuestion, update, handleDeleteItem, disabled}) => {  

  const handleOptionUpdate = (value: string, option: IQuestionOptionRspModel) => {
    if(currentQuestion?.questionOptions) {
      const options = currentQuestion?.questionOptions;
      const index = options.findIndex(c=>c.key === option.key);

      options[index].optionContent = value;
      update({questionOptions: [...options]})
    }
  }

  const handleOptionDelete = (option: IQuestionOptionRspModel) => {
    if(currentQuestion?.questionOptions) {
      const options = currentQuestion?.questionOptions;
      const index = options.findIndex(c=>c.key === option.key);
      options.splice(index, 1);
      update({questionOptions: [...options]})

      if(handleDeleteItem) {
        handleDeleteItem(option)
      }
    }
  }

  const handelAnswerChange = (value: string | string []) => {
    if(currentQuestion?.questionOptions) {
      const questionOptions = currentQuestion?.questionOptions;
      if(value instanceof Array) {
        if(value.length > 0) {
          questionOptions.forEach((item) => {
            if(value.includes(item.key) && !item.isAnswer){
              item.isAnswer = true
            }
            else if(!value.includes(item.key) && item.isAnswer) {
              item.isAnswer = false
            }
          })
          
          update({questionOptions: [...questionOptions]})
        }        
      }
      else {
        questionOptions.forEach((item) => {
          if(item.key === value && !item.isAnswer){
            item.isAnswer = true
          }
          else if(item.key !== value && item.isAnswer) {
            item.isAnswer = false
          }
        })

        update({questionOptions: [...questionOptions]})
      }      
    }
  };

  const optionsElement = () => {
    if (currentQuestion && currentQuestion.questionOptions){
      if (currentQuestion.type === '单选') {
        return (
          <>
            <Radio.Group disabled={disabled} onChange={(e) => handelAnswerChange(e.target.value)} value={currentQuestion.questionOptions.find(c=>c.isAnswer)?.key}>
              <Space direction="vertical">
                {currentQuestion.questionOptions.map((option, index) => {
                  return option.key && (
                    <Radio key={option.key} value={option.key}>
                      <Space>
                        <Input key={option.key} disabled={disabled} value={option.optionContent} onChange={(e)=> handleOptionUpdate(e.target.value, option)} />
                        <Button hidden={disabled} size='small' type='primary' onClick={() => handleOptionDelete(option)}>删除</Button>
                      </Space>
                    </Radio>)
                })}
              </Space>
            </Radio.Group>
          </>
        )
      }
      else {
        return (
          <>
            <Checkbox.Group disabled={disabled} onChange={(e) => handelAnswerChange(e as string[])} value={currentQuestion.questionOptions.filter(c=>c.isAnswer).map(c=>c.key)}>
              <Space direction="vertical">
                {currentQuestion?.questionOptions.map((option, index) => option.key && (
                  <Checkbox key={option.key} value={option.key}>
                    <Space>
                      <Input key={option.key} disabled={disabled} value={option.optionContent} onChange={(e)=> handleOptionUpdate(e.target.value, option)} />
                      <Button hidden={disabled} size='small' type='primary' onClick={() => handleOptionDelete(option)}>删除</Button>
                    </Space>
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </>
        )
      }
    }   
  }

  return (
    <>
      {optionsElement()}
    </>    
  )
}