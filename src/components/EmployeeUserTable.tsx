import { Avatar, Button, ConfigProvider, Empty } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { IEmployeeUserRspModel } from 'models';
import moment from 'moment';
import React, { FunctionComponent } from 'react';
import { UserOutlined } from "@ant-design/icons";

export const EmployeeUserTable : FunctionComponent<{currentEmployees: IEmployeeUserRspModel[] | undefined, handleSelect: any, emptyNode?: React.ReactNode}> 
= ({currentEmployees, handleSelect, emptyNode}) => {
  const columns : ColumnsType<IEmployeeUserRspModel> = [
    {
      title: '头像',
      dataIndex: 'weChatImagePath',
      key: 'weChatImagePath',
      ellipsis: true,
      width: '15%',
      render: (image: string | undefined) => {
        return (image ? 
          <Avatar src={image} /> : 
          <Avatar icon={<UserOutlined />} />
        )
      }
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '企业类型',
      dataIndex: 'businessType',
      key: 'businessType',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '单位',
      dataIndex: 'company',
      key: 'company',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '有效期',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      ellipsis: true,
      width: '20%',
      render:(expirationDate?: Date) => {
        let result : string
        const currentDate = new Date()        
        if(expirationDate && moment(expirationDate) > moment(currentDate)) {
          result = moment(expirationDate).format('YYYY-MM-DD')
        }
        else if(expirationDate && moment(expirationDate) < moment(currentDate)) {
          result = '已失效'
        }
        else {
          result = "未激活"
        }

        return result
      }
    },
    {
      title: '',
      key: 'action',
      width: '30%',
      render: (text, record) => {
        let result :JSX.Element
        const currentDate = new Date()
        if(record.expirationDate && moment(record.expirationDate) < moment(currentDate)) {
          result = <Button size='small' type="primary" onClick={()=> handleSelect(record)}>重新激活</Button>
        }
        else {
          result = <Button size='small' type="primary" onClick={()=> handleSelect(record)}>激活</Button>
        }

        return result
      }
    }
  ]

  return (
    <Table 
      locale={{
        emptyText: emptyNode
      }}
      dataSource={currentEmployees}
      size={'small'}
      rowKey={record => record.userId} 
      columns={columns} />    
  );
}
