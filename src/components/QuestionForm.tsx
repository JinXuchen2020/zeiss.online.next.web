import { Button, Form, Input, Select, Space} from 'antd';
import { QuestionOptions } from 'components';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { IQuestionGroupRspModel, IQuestionOptionRspModel, IQuestionRspModel } from "../models";

export const QuestionForm : FunctionComponent<{currentQuestionGroup: IQuestionGroupRspModel | undefined, currentQuestion: IQuestionRspModel | undefined, questionGroups: IQuestionGroupRspModel[] | undefined, isEdit: any, update: any, changeGroup: any, save: any, handleDelete: any, disabled?: boolean}> 
= ({currentQuestionGroup, currentQuestion, questionGroups, isEdit, update, changeGroup, save, handleDelete, disabled}) => {

  const deleteOptions : IQuestionOptionRspModel[] = []

  const [form] = Form.useForm()
  
  const handleSubmit = () => {
    form.validateFields().then(() =>{
      save(deleteOptions, !disabled)
    })
    .catch(() => {
    })
  };

  const handleUpdate = async (props: Partial<IQuestionRspModel>) => {
    update(props)
    await form.validateFields()
  }

  const nameValidator = (rule: any, value: any, callback: any) =>{
    if(value && currentQuestionGroup && currentQuestion) {
      const questionIndex = currentQuestionGroup.questions.findIndex(c=>c.stem === value);
      if (questionIndex < 0) {
        callback()
      }
      else {
        if ((currentQuestionGroup.questions[questionIndex].id && currentQuestionGroup.questions[questionIndex].id !== currentQuestion.id) ||
        (currentQuestionGroup.questions[questionIndex].id === undefined)) {
          callback('题目题干已存在!');
        }
        else {
          callback()
        }
      }
    }
    else{
      callback();
    }
  }

  const optionValidator = (rule: any, value: any, callback: any) =>{
    if(currentQuestion?.questionOptions && currentQuestion.questionOptions.length > 0) {
      callback();
    }
    else{
      callback('请至少添加一个选项');
    }
  }

  const optionContentValidator = (rule: any, value: any, callback: any) =>{
    if(currentQuestion?.questionOptions && currentQuestion.questionOptions.length > 0) {
      const emptyOptions = currentQuestion.questionOptions.filter(c=>c.optionContent.length === 0)
      if(emptyOptions.length === 0) {
        callback();
      }
      else {
        callback('有些选项未填写内容');
      }
    }
    else {
      callback();
    }
  }

  const optionContentNameValidator = (rule: any, value: any, callback: any) =>{
    if(currentQuestion?.questionOptions 
      && currentQuestion.questionOptions.length > 0 
      && currentQuestion.questionOptions.every(c => c.optionContent.length > 0)) 
    {
      const result = currentQuestion.questionOptions.findIndex((option, index, options) => {
        const nextOptions = options.filter((option, nextIndex) => nextIndex > index);
        return nextOptions.find(c => option.optionContent === c.optionContent) !== undefined
      }) === -1
      if(result) {
        callback();
      }
      else {
        callback('选项内容重复')
      }
    }
    else {
      callback();
    }
  }

  const answerValidator = (rule: any, value: any, callback: any) => {
    if(currentQuestion?.questionOptions 
      && currentQuestion.questionOptions.length > 0 
      && currentQuestion.questionOptions.every(c => c.optionContent.length > 0)
      && currentQuestion.questionOptions.findIndex((option, index, options) => {
        const nextOptions = options.filter((option, nextIndex) => nextIndex > index);
        return nextOptions.find(c => option.optionContent === c.optionContent) !== undefined
      }) === -1
    ) 
    {
      const answers = currentQuestion.questionOptions.filter(c => c.isAnswer)
      if(currentQuestion.type === "单选" && answers.length === 0) {
        callback('请至少选择一个答案');
      }
      else if(currentQuestion.type === "多选" && answers.length < 2)
      {
        callback('请至少选择二个答案');
      }
      else {
        callback();
      }
    }
    else {
      callback();
    }
  }

  const changeExamType = (value: string) => {
    if(currentQuestion) {
      if(value === "单选") {
        const options = currentQuestion.questionOptions;
        const answerIndex = currentQuestion.questionOptions.findIndex(c=>c.isAnswer);
        options.forEach((item, index) => {
          if(item.isAnswer && index > answerIndex) {
            item.isAnswer = false
          }
        })
  
        update({type: value, questionOptions: [...options]});
      }
      else {
        update({type: value });
      }
    }    
  }

  const handleOptionAdd = () => {
    if(currentQuestion) {
      if(currentQuestion.questionOptions.length > 0) 
      {
        const lastKeyNumber = currentQuestion.questionOptions.slice(-1)[0].key.charCodeAt(0)
        const newOption : IQuestionOptionRspModel = {
          questionId: currentQuestion?.id,
          optionContent: '',
          isAnswer: false,
          key: String.fromCharCode(lastKeyNumber + 1)
        }

        update({questionOptions:[...currentQuestion.questionOptions, newOption]})
      }
      else {
        const newOption : IQuestionOptionRspModel = {
          questionId: currentQuestion?.id,
          optionContent: '',
          isAnswer: false,
          key: 'A'
        }
        update({questionOptions:[newOption]})
      }
    }
  }

  const handelGroupChange = (value: string) => {
    if(questionGroups){
      const selectGroup = questionGroups.find(c => c.name === value);
      if(selectGroup) {
        changeGroup(selectGroup)
      }
    }
  };

  useEffect(() => {
    if(currentQuestion) {
      form.setFieldsValue(currentQuestion);
      const options = currentQuestion.questionOptions;
      if(options.findIndex(c => c.key === undefined) >= 0) {
        const baseKeyNumber : number = 'A'.charCodeAt(0);
        options.forEach((item, index) => {
          if(item.key === undefined) {
            item.key = String.fromCharCode(baseKeyNumber + index)
          }
        })

        update({questionOptions:[...options]})
      }      
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, form]);

  return (
    <>
      <Form        
        layout={'vertical'}
        form={form}
      >
        <Form.Item 
          label="题目"
          name={"stem"}
          rules={[{validator: nameValidator}, {required: true, whitespace: true, message: '请输入题目题干' }]}
        >
          <Input.TextArea disabled={disabled} placeholder="请输入题干" value={currentQuestion?.stem} onChange={(val) => update({stem: val.target.value})}/>
        </Form.Item>
        <Form.Item label="类型">
          <Select disabled={disabled} value={currentQuestion?.type} onChange={changeExamType}>
            <Select.Option value={'单选'}>单选</Select.Option>
            <Select.Option value={'多选'}>多选</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item 
          label="选项"
          name="options"
          rules={[{validator: optionValidator}, {validator: answerValidator}, {validator: optionContentValidator}, {validator: optionContentNameValidator}]}
        >
          <QuestionOptions 
            currentQuestion={currentQuestion}
            update={handleUpdate}
            disabled={disabled}
            handleDeleteItem={(option: IQuestionOptionRspModel) => {
              if(option.id && deleteOptions.findIndex(c=>c.id === option.id)){
                deleteOptions.push(option)
              }
            }} />
        </Form.Item>
        <Form.Item>
          <Button
            type="dashed"
            hidden={disabled}
            onClick={handleOptionAdd}
            style={{ width: '60%', marginTop: 10 }}
          >
            添加项
          </Button>
        </Form.Item>
        <Form.Item label="试题组">
          <Select
            disabled={disabled}
            onChange={handelGroupChange}
            value={currentQuestionGroup?.name}
          >
            {questionGroups && questionGroups.map((item, index) => (
              <Select.Option key={index} value={item.name}>
              {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button hidden={disabled} type="primary" onClick={handleSubmit}>保存</Button>
            <Button hidden={!disabled} type="primary" onClick={handleSubmit}>关闭</Button>
            <Button hidden={disabled} type="primary" onClick={handleDelete}>删除</Button>
          </Space>          
        </Form.Item>
      </Form>
    </>    
  )
}