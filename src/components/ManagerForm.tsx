import { Button, Checkbox, Form, Input, List, Space} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ConfirmModal } from 'components';
import React, { FunctionComponent, useState } from 'react';
import { IEnterpriseUserRspModel, IRoleRspModel } from "../models";

export const ManagerForm : FunctionComponent<{currentManager: IEnterpriseUserRspModel | undefined, allRoles: IRoleRspModel[] | undefined, isEdit: boolean, update: any, save: any, cancel: any, handleDelete: any}> 
= ({currentManager, allRoles, isEdit, update, save, cancel, handleDelete}) => {

  const [form] = Form.useForm()

  const [deleteRoles, setDeleteRoles] = useState<IRoleRspModel[]>([])

  const handleSubmit = async () => {
    form.validateFields().then(() =>{
      save(deleteRoles)
    })
    .catch(() => {   
    })   
  };

  const handleCancel = async () => {
    cancel()   
  };

  const handleRoleChange = (e: CheckboxChangeEvent, item: IRoleRspModel) => {
    e.preventDefault()
    if(currentManager) {
      const result = e.target.checked
      const currentRoles = currentManager.managementModules
      if(result) {
        currentRoles.push(item)
        update({managementModules: currentRoles})
        const index = deleteRoles.findIndex(c=>c.id === item.id)
        deleteRoles.splice(index, 1)
      }
      else {
        deleteRoles.push(item)
        const index = currentRoles.findIndex(c=>c.id === item.id)
        currentRoles.splice(index, 1)
        update({managementModules: currentRoles})
      }
    }
  }

  const handleDeleteConfirm =() => {
    ConfirmModal({
      title: "是否删除管理员？", 
      confirm: () => handleDelete()
    })
  }

  return (
    <>
      <Form        
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item 
          label="姓名"
        >
          <Input value={currentManager?.name} readOnly={true} />
        </Form.Item>
        <Form.Item label="权限">
          <List
            itemLayout="horizontal"
            rowKey={c=>c.id!}
            dataSource={allRoles}
            renderItem={(item, index) => (
              <List.Item
                key={item.id!}
                actions={              
                  [
                    currentManager?.managementModules && <Checkbox checked={currentManager.managementModules.findIndex(c=>c.id === item.id)>= 0} onChange={(e) => handleRoleChange(e, item)} />
                  ]
                }
              >
                {item.name}
              </List.Item>
            )}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }} style={{textAlign: 'center'}}>
          <Space>
            <Button type="primary" onClick={handleSubmit}>保存</Button>
            <Button type="default" onClick={handleCancel}>取消</Button>
            <Button hidden={!isEdit} type="default" onClick={handleDeleteConfirm}>删除</Button>
          </Space>
        </Form.Item>
      </Form>
    </>    
  )
}