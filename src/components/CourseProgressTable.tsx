import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ICourseProgressRspModel } from 'models';
import moment from 'moment';
import React, { FunctionComponent } from 'react';

export const CourseProgressTable : FunctionComponent<{currentCourseProgress: ICourseProgressRspModel[] | undefined}> 
= ({currentCourseProgress}) => {  
  const columns : ColumnsType<ICourseProgressRspModel> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 100,
      fixed: 'left',
    },
    {
      title: '手机',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      ellipsis: true,
      width: 100,
      fixed: 'left',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      width: 200,
    },
    {
      title: '单位',
      dataIndex: 'company',
      key: 'company',
      ellipsis: true,
      width: 100,
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      ellipsis: true,
      width: 120,
    },
    {
      title: '学院/科室',
      dataIndex: 'technicalOffice',
      key: 'technicalOffice',
      ellipsis: true,
      width: 100,
    },
    {
      title: '注册时间',
      dataIndex: 'registerDate',
      key: 'registerDate',
      ellipsis: true,
      width: 80,
      render:(registerDate: Date) => moment(registerDate).format('YYYY-MM-DD'),
      sorter: (a, b) => compareDate(a, b),
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',      
    },
    {
      title: '产品类别',
      dataIndex: 'courseCategory',
      key: 'courseCategory',
      ellipsis: true,
      width: 100,
    },
    {
      title: '学习进度',
      dataIndex: 'progress',
      key: 'progress',
      ellipsis: true,
      width: 70,
      render:(value: number) => `${value}%`,
      fixed: 'right',
    },
    {
      title: '考试时间',
      dataIndex: 'examDate',
      key: 'examDate',
      ellipsis: true,
      width: 80,
      render:(examDate?: Date) => examDate ? moment(examDate).format('YYYY-MM-DD') : undefined,
      sorter: (a, b) => compareDate(a, b),
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
      fixed: 'right',
    },
    {
      title: '考试成绩',
      dataIndex: 'examScore',
      key: 'examScore',
      ellipsis: true,
      width: 80,
      fixed: 'right',
    },
  ]

  const compareDate = (a: ICourseProgressRspModel, b: ICourseProgressRspModel)=> {
    const left = a.registerDate ? moment(a.registerDate).unix() : 0;
    const right = b.registerDate ? moment(b.registerDate).unix() : 0;
    return left - right;
  }

  return (
    <Table 
      dataSource={currentCourseProgress}
      size={'small'}
      rowKey={record => record.id}
      scroll={{ x: 1300 }}
      columns={columns} />
  );
}
