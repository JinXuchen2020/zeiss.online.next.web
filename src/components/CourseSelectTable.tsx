import { Button, Table } from "antd"
import React, { FunctionComponent } from "react";
import { ICourseRspModel, IUserRspModel } from "models";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";

export const CourseSelectTable : FunctionComponent<{currentCourses: ICourseRspModel[] | undefined, loading: boolean, handleSelect?: any}> 
= ({currentCourses, loading, handleSelect}) => {
  
  const columns : ColumnsType<ICourseRspModel> = [
    {
      title: '类型',
      dataIndex: 'categoryRootName',
      key: 'categoryRootName',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '45%',
    },
    {
      title: '发布者',
      dataIndex: 'publishedBy',
      key: 'publishedBy',
      width: '15%',
      render: (publishedBy: IUserRspModel | undefined) => publishedBy && publishedBy.name,
      responsive: ['xl'],
    },
    {
      title: '发布时间',
      dataIndex: 'publishedDate',
      key: 'publishedDate',
      width: '15%',
      render: (publishedDate: Date | undefined) => publishedDate && moment(publishedDate).format('YYYY-MM-DD'),
      sorter: (a, b) => compareDate(a, b),
      responsive: ['lg'],
    },
    {
      title: '',
      key: 'action',
      width: handleSelect === undefined ? '0' : "10%",
      render: (text, record) => (
        handleSelect && <Button size='small' type="primary" onClick={() => handleSelect(record)}>选择</Button>
      )
    }
  ]

  const compareDate = (a: ICourseRspModel, b: ICourseRspModel)=> {
    const left = a.publishedDate ? moment(a.publishedDate).unix() : 0;
    const right = b.publishedDate ? moment(b.publishedDate).unix() : 0;
    return left - right;
  }

  return (
    <Table 
      size={'small'}
      loading={loading}
      dataSource={currentCourses}
      rowKey={'id'}
      columns={columns} />
  )
}
