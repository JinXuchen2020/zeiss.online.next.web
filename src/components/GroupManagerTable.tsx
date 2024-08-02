import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { IGroupManagerLiteRspModel } from 'models';
import React, { FunctionComponent } from 'react';

export const GroupManagerTable : FunctionComponent<{currentGroupManagers: IGroupManagerLiteRspModel[] | undefined, loading: boolean, handleSelect: any}> 
= ({currentGroupManagers, loading, handleSelect}) => {  
  const columns : ColumnsType<IGroupManagerLiteRspModel> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 80,
    },
    {
      title: '手机',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ellipsis: true,
      width: 100,
    },
    {
      title: '单位',
      dataIndex: 'company',
      key: 'company',
      ellipsis: true,
      width: 100,
    },
    {
      title: '区域',
      dataIndex: 'province',
      key: 'province',
      ellipsis: true,
      width: 100,
    },
    {
      title: '课程数',
      dataIndex: 'courseCount',
      key: 'courseCount',
      ellipsis: true,
      width: 60,
    },
    {
      title: '小组数',
      dataIndex: 'groupCount',
      key: 'groupCount',
      ellipsis: true,
      width: 60,
    },
    
    {
      title: '邀请人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      ellipsis: true,
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate',
      key: 'createdDate',
      ellipsis: true,
      width: 100,
    },
    {
      title: '',
      key: 'action',
      width: 45,
      fixed: 'right',
      render: (text, record) => (
        handleSelect && <Button size='small' type="primary" onClick={()=> handleSelect(record)}>编辑</Button>
      )
    }
  ]

  return (
    <Table 
      loading={loading}
      dataSource={currentGroupManagers}
      size={'small'}
      rowKey={record => record.id}
      scroll={{ x: 1000 }}
      columns={columns} />
  );
}
