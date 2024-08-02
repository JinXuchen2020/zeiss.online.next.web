import { Button, Col, Descriptions, Form, FormInstance, Input, Row, Space } from 'antd';
import { CourseSelectedTable } from 'components';
import { ICourseRspModel, IGroupManagerStatusRspModel } from 'models';
import React, { FunctionComponent, useEffect, useState } from 'react';

export const GroupManagerForm : FunctionComponent<{currentGroupManager: IGroupManagerStatusRspModel | undefined, update: any, showCourseSelect: any, showGroupStatus: any, handleSave: any, handleDelete: any, showSwitchManager: any, form: FormInstance, handleDeleteItem?: any}> 
= ({currentGroupManager, update, showCourseSelect, showGroupStatus, handleSave, handleDelete, showSwitchManager, form, handleDeleteItem}) => {

  const [groupUserCount, setGroupUserCount] = useState(0)

  const coursesValidator = (rule: any, value: any, callback: any) =>{
    if(currentGroupManager?.manager.courses && currentGroupManager?.manager.courses.length > 0) {
      callback();
    }
    else {
      callback('请至少选择一个课程!');
    }
  }

  const handleDeleteCourse = (course: ICourseRspModel) => {    
    handleDeleteItem(course)
  }

  useEffect(()=>{
    if(currentGroupManager?.groups && currentGroupManager.groups.length > 0) {
      const userCount = eval(currentGroupManager.groups.map(c=>c.userCount).join("+"))
      setGroupUserCount(userCount)
    }
  }, [currentGroupManager?.groups])
  
  return (
    <Row gutter={24}>
      <Col span={18}>
        <Form form={form}>
          <Row style={{marginBottom: 14}}>
            <Col span={24}>
              <Space style={{float: 'right'}}>                
                <Button type='primary' onClick={showCourseSelect}>添加课程</Button>
              </Space>
            </Col>
          </Row>
          <Form.Item 
            name="courses"
            wrapperCol={{span: 23, offset: 1}}
            rules={[{validator: coursesValidator}]}
            style={{height: '480px'}}>
            <CourseSelectedTable 
              currentCourses={currentGroupManager?.manager.courses} 
              loading={false} 
              handleUnSelect={handleDeleteCourse} />
          </Form.Item>
          <Form.Item label={"备注"}>
            <Input.TextArea rows={4} value={currentGroupManager?.manager.comment} onChange={(val: any) => update({manager: {...currentGroupManager?.manager, comment: val.target.value}})}></Input.TextArea>
          </Form.Item>
          {
            currentGroupManager?.manager.id && 
            <Row gutter={24}>
              <Col span={18} offset={1}>
                <Space direction="horizontal">
                  <label>使用情况    小组人数 {groupUserCount}  组数 {currentGroupManager?.groups.length}</label>
                  <Button type='text' onClick={showGroupStatus}>{'详情>'}</Button>
                </Space>
              </Col>
            </Row>
          }
          <Form.Item style={{textAlign:'center'}}>
            <Space>                
              <Button type='primary' onClick={()=> handleSave()}>保存</Button>
              <Button type='primary' onClick={()=> handleDelete()}>删除</Button>
              <Button type='primary' onClick={()=> showSwitchManager()}>换组长</Button>
            </Space>
          </Form.Item>
        </Form>        
      </Col>
      <Col span={6}>
        <Descriptions 
          title="注册信息" 
          layout={'horizontal'}
          column={1}
          labelStyle={{width: '35%'}}
          bordered
        >
          <Descriptions.Item label="姓名">{currentGroupManager?.manager.user.name}</Descriptions.Item>
          <Descriptions.Item label="行业">{currentGroupManager?.manager.user.industry?.name ?? currentGroupManager?.manager.user.industryText }</Descriptions.Item>
          <Descriptions.Item label="单位">{currentGroupManager?.manager.user.company}</Descriptions.Item>
          <Descriptions.Item label="电话">{currentGroupManager?.manager.user.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{currentGroupManager?.manager.user.email}</Descriptions.Item>
          <Descriptions.Item label="企业类型">{currentGroupManager?.manager.user.businessType?.name}</Descriptions.Item>
          <Descriptions.Item label="区县">{currentGroupManager?.manager.user.city?.name}</Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
}
