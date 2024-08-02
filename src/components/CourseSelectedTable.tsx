import { Button, Table } from "antd"
import React, { FunctionComponent } from "react";
import {  ICourseRspModel } from "models";
import { ColumnsType } from "antd/lib/table";

export const CourseSelectedTable : FunctionComponent<{currentCourses: any, loading: boolean, handleUnSelect: any}> 
= ({currentCourses, loading, handleUnSelect}) => {  
  const columns : ColumnsType<ICourseRspModel> = [
    {
      title: '类型',
      dataIndex: 'categoryRootName',
      key: 'categoryRootName',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '50%',
    },
    {
      title: '',
      key: 'action',
      width: '20%',
      render: (text, record) => (
        <Button size='small' type="primary" onClick={() => handleUnSelect(record)}>取消</Button>
      )
    }
  ]

  return (
    <>
      <Table 
        size={'small'}
        loading={loading}
        dataSource={currentCourses}
        rowKey={'id'}
        columns={columns} />
    </>
  )
}
