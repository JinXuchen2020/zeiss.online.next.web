import { Button, Form, Input, List, Row } from 'antd';
import { ConfirmModal } from 'components';
import React, { FunctionComponent, useState } from 'react';
import { ISeriesNumberRspModel, ISingleCategoryRspModel } from "../models";

export const SeriesNumberList : FunctionComponent<{currentCategory: ISingleCategoryRspModel | undefined, manage: any, handleDelete: any}> 
= ({currentCategory, manage, handleDelete}) => {  

  const [isEdit, setIsEdit] = useState(false)

  const [rowKey, setRowKey] = useState<string>()

  const [currentPage, setCurrentPage] = useState<number>(1)

  const [form] = Form.useForm();

  const [editForm] = Form.useForm();

  const nameValidator = (rule: any, value: any, callback: any) =>{
    if(value && currentCategory) {
      const record = currentCategory.seriesNumbers.find(c=>c.seriesNumbers === value);
      if(record && record.id !== rowKey) {
        callback('序列号已存在!');
      }
      else {
        callback();
      }
    }
    else {
      callback();
    }
  }

  const handleChange = async (seriesNumber: ISeriesNumberRspModel) => {
    const newValue = await editForm.validateFields() as ISeriesNumberRspModel;
    const newSN = {...seriesNumber, seriesNumbers: newValue.seriesNumbers};
    manage(newSN)

    setIsEdit(false)
    editForm.resetFields()   
  }

  const handleAdd = async () => {
    if(currentCategory) {
      const newSN = await form.validateFields() as ISeriesNumberRspModel;
      newSN.courseCategoryId = currentCategory.id!

      manage(newSN)
      form.resetFields()

      if (currentCategory.seriesNumbers.length + 1 / 5 > currentPage) {
        setCurrentPage(currentPage + 1)
      }
    }
  }

  const handleEdit = (item: ISeriesNumberRspModel) => {
    setIsEdit(true);
    setRowKey(item.id)

    editForm.setFieldsValue(item)
  }

  const deleteConfirm = (record: ISeriesNumberRspModel) => {
    ConfirmModal({
      title: "是否删除序列号", 
      confirm: () => handleDelete(record)
    })
  }

  return (
    <>
      <List
        itemLayout="horizontal"
        rowKey={c=>c.id!}
        pagination={{
          pageSize: 5,
          size: "small",
          current: currentPage,
          showSizeChanger: false,
          onChange: (page) => setCurrentPage(page)
        }}
        dataSource={currentCategory?.seriesNumbers}
        footer= {
          (
            <Row style={{marginTop: 10}}>
              <Form form={form} layout="inline" onFinish={() => handleAdd()}>
                <Form.Item 
                  name={"seriesNumbers"}
                  rules={[{required: true, whitespace: true, message: '请输入序列号'}, {validator: nameValidator}]}
                >
                  <Input size='small' autoComplete="off" placeholder="序列号" />
                </Form.Item>
                <Form.Item>
                  <Button size='small' type="primary" onClick={() => handleAdd()}>新增</Button>
                </Form.Item>
              </Form>
            </Row>
          )
        }
        renderItem={(item, index) => (
          <List.Item
            key={item.id!}
            actions={ 
              isEdit && rowKey === item.id ?
              [
                <Button size='small' type="primary" onClick={() => handleChange(item)}>保存</Button>,
                <Button size='small' type="primary" onClick={() => setIsEdit(false)}>取消</Button>,
              ] :            
              [
                <Button size='small' type="primary" onClick={() => handleEdit(item)}>编辑</Button>,
                <Button size='small' type="primary" onClick={() => deleteConfirm(item)}>删除</Button>,
              ]
            }
          >
            {
              isEdit && rowKey === item.id ?
              <Form form={editForm} layout="inline" onFinish={() => handleChange(item)}>
                <Form.Item 
                  name={"seriesNumbers"}
                  rules={[{validator: nameValidator}]}
                >
                  <Input size='small' placeholder="序列号" />
                </Form.Item>
              </Form> :
              <label>{item.seriesNumbers}</label>
            }
          </List.Item>
        )}
      />
    </>    
  )
}