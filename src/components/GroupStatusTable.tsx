import { Button, Table } from "antd"
import React, { FunctionComponent } from "react";
import { IGroupStatusRspModel, IUserRspModel } from "models";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";

export const GroupStatusTable : FunctionComponent<{currentGroups: IGroupStatusRspModel[] | undefined, loading: boolean, handleSelect?: any}> 
= ({currentGroups, loading, handleSelect}) => {  
  const columns : ColumnsType<IGroupStatusRspModel> = [
    {
      title: '学习小组',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '人数',
      dataIndex: 'userCount',
      key: 'userCount',
      ellipsis: true,
      width: 80,
    },
    {
      title: '完成全部课程人数',
      dataIndex: 'completeUserCount',
      key: 'completeUserCount',
      ellipsis: true,
      width: 150,
    },
    {
      title: '课程',
      dataIndex: 'courseCount',
      key: 'courseCount',
      ellipsis: true,
      width: 80,
    },
    {
      title: '完成比例',
      dataIndex: 'percent',
      key: 'percent',
      ellipsis: true,
      width: 100,
    },
    {
      title: '邀请人',
      dataIndex: 'createdBy',
      key: 'createdBy',
      ellipsis: true,
      width: 100,
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
      fixed: handleSelect === undefined ? undefined :'right',
      width: handleSelect === undefined ? 1 : 60,
      render: (text, record) => (
        handleSelect && <Button size='small' type="primary" onClick={()=> handleSelect(record)}>查看</Button>
      )
    }
  ]

  return (
    <>
      <Table 
        size={'small'}
        loading={loading}
        dataSource={currentGroups}
        rowKey={record => record.id!}
        scroll={{ x: 1000 }}
        columns={columns} />
    </>
  )
}
