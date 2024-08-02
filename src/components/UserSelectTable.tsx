import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { IUserRspModel } from 'models';
import React, { FunctionComponent } from 'react';

export const UserSelectTable : FunctionComponent<{currentUsers: IUserRspModel[] | undefined, loading: boolean, handleSelect: any}> 
= ({currentUsers, loading, handleSelect}) => {
  const columns : ColumnsType<IUserRspModel> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '手机',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
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
      title: '区域',
      dataIndex: 'city',
      key: 'city',
      ellipsis: true,
      width: '20%',
      render:(record: IUserRspModel) => record.province && `${record.province?.name}/${record.city?.name}` 
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      ellipsis: true,
      width: '20%',
      render:(record: IUserRspModel) => record.industry?.name ?? record.industryText
    },
    {
      title: '邀请人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      ellipsis: true,
      width: '20%',
      render:(createdBy: IUserRspModel) => createdBy.name
    },
    {
      title: '',
      key: 'action',
      width: '30%',
      render: (text, record) => (
        <Button size='small' type="primary" onClick={()=> handleSelect(record)}>设为组长</Button>
      )
    }
  ]

  return (
    <Table 
      loading={loading}
      dataSource={currentUsers}
      size={'small'}
      rowKey={record => record.id} 
      columns={columns} />
  );
}
