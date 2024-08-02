import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { IReportRspModel } from 'models';
import moment from 'moment';
import React, { FunctionComponent } from 'react';

export const ReportTable : FunctionComponent<{currentReports: IReportRspModel[] | undefined, loading: boolean, handleSelect?: any}> 
= ({currentReports, loading, handleSelect}) => {
  const columns : ColumnsType<IReportRspModel> = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '35%',
      fixed: 'left',
    },
    {
      title: '状态',
      dataIndex: 'isPublished',
      key: 'isPublished',
      width: '8%',
      ellipsis: true,
      render: (state: boolean) => 
      {
        switch(state) {
          case false:
            return '未发布';
          case true:
            return '发布';
        }
      },
      responsive: ['md'],
    },
    {
      title: '发布者',
      dataIndex: 'publishedBy',
      key: 'publishedBy',
      width: '10%',
      responsive: ['xl'],
    },
    {
      title: '发布时间',
      dataIndex: 'publishedDate',
      key: 'publishedDate',
      width: '10%',
      ellipsis: true,
      render: (publishedDate: Date | undefined) => publishedDate && moment(publishedDate).format('YYYY-MM-DD'),
      sorter: (a, b) => compareDate(a, b),
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
    },
    {
      title: '独立访客',
      dataIndex: 'browserCount',
      key: 'browserCount',
      width: '10%',
      sorter: (a, b) => a.browserCount - b.browserCount,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '访问次数',
      dataIndex: 'hits',
      key: 'hits',
      width: '10%',
      sorter: (a, b) => a.hits - b.hits,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '成功分享次数',
      dataIndex: 'shareCount',
      key: 'shareCount',
      width: '13%',
      sorter: (a, b) => a.shareCount - b.shareCount,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '收藏次数',
      dataIndex: 'collectionCount',
      key: 'collectionCount',
      width: '10%',
      sorter: (a, b) => a.collectionCount - b.collectionCount,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '完成次数',
      dataIndex: 'completedCount',
      key: 'completedCount',
      width: '10%',
      sorter: (a, b) => a.completedCount - b.completedCount,
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '',
      key: 'action',
      width: handleSelect === undefined? 0 : 100,
      fixed: 'right',
      render: (text, record) => (
        handleSelect && <Button size='small' type="primary" onClick={()=> handleSelect(record)}>查看进度</Button>
      )
    }
  ]

  const compareDate = (a: IReportRspModel, b: IReportRspModel)=> {
    const left = a.publishedDate ? moment(a.publishedDate).unix() : 0;
    const right = b.publishedDate ? moment(b.publishedDate).unix() : 0;
    return left - right;
  }

  return (
    <Table 
      loading={loading}
      dataSource={currentReports}
      size={'small'}
      pagination={{
        size:"small",
        pageSize: 20,
      }}
      rowKey={record => record.id} 
      scroll={{ x: 1300 }}
      columns={columns} />
  );
}
