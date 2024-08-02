import React, { useState } from 'react';
import { IQuestionGroupRspModel, IQuestionRspModel } from 'models';
import { Button, Card, Divider, InputNumber, List, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { QuestionItem } from 'components';

export const QuestionGroup: React.FunctionComponent<{currentQuestionGroup: IQuestionGroupRspModel, manage: any, update: any, disabled?: boolean}> 
= ({currentQuestionGroup, manage, update, disabled}) => {

  const [currentPage, setCurrentPage] = useState(1)
  const handleAdd = (type: string) => {
    const newQuestion: IQuestionRspModel = {
      stem: "",
      type: type,
      level: "",
      questionGroupId: currentQuestionGroup.id,
      questionOptions: [],
    }

    manage(newQuestion);
    setCurrentPage(currentQuestionGroup.questions.length + 1)
  }

  const handleEdit = (question: IQuestionRspModel) => {
    manage(question);
  }

  return (
    <>
      <Card 
        hoverable={true} 
        size='small'
        title={<Typography.Text style={{width: "30%"}} editable={disabled ? false : { onChange: (value) =>update({name: value}) }}>{currentQuestionGroup.name}</Typography.Text> } 
        actions={[
          <Button hidden={disabled} type='text' size='small' icon={<PlusOutlined />} onClick={()=> handleAdd("单选")}>单选</Button>,
          <Button hidden={disabled} type='text' size='small' icon={<PlusOutlined />} onClick={()=> handleAdd("多选")}>多选</Button>
        ]}
      >
        <List
          itemLayout="horizontal"
          rowKey={c=>c.stem}
          dataSource={currentQuestionGroup.questions}
          pagination={{
            size:"small",
            pageSize: 5,
            current: currentPage,
            hideOnSinglePage: true,
            onChange: (page) => setCurrentPage(page)
          }} 
          renderItem={item => (
            <QuestionItem currentQuestion={item} manage={handleEdit} disabled={disabled} />
          )}
        />
      </Card>

      <Space style={{marginTop: 10}} direction="vertical">
        <label>共{currentQuestionGroup.questions.length}道试题</label>
        <div>随机选择 <InputNumber 
          style={{width: 50}} 
          disabled={disabled}
          size='small' 
          min={0}
          max={currentQuestionGroup.questions.length} 
          value={currentQuestionGroup.selectedQuestionNumber} 
          onChange={(value) => {
            if(value === null) {
              value = 0
            }
            update({selectedQuestionNumber: value}, currentQuestionGroup)} 
          }/> 题 出现</div>
      </Space>
      <Divider />
    </>
  )
}
