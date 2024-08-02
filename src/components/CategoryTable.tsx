import { Table, Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { CategoryType, ISeriesNumberRspModel, ISingleCategoryRspModel } from 'models';
import React, { FunctionComponent } from 'react';
import { SeriesNumbersText } from 'components';

export const CategoryTable : FunctionComponent<{currentCategories: ISingleCategoryRspModel[] | undefined, loading: boolean, handleSelect: any}> 
= ({currentCategories, loading, handleSelect}) => {

  const columns : ColumnsType<ISingleCategoryRspModel> = [
    {
      title: `${CategoryType[1]}主目录`,
      dataIndex: 'parent',
      key: 'parent',
      ellipsis: true,
      width: '15%',
      render: (parent: ISingleCategoryRspModel) => parent.title,
      sorter: (a, b) => a.parent?.title.charCodeAt(0)! - b.parent?.title.charCodeAt(0)!,
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'descend',
    },
    {
      title: `${CategoryType[1]}分类`,
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: '25%',
    },
    {
      title: '序列号',
      dataIndex: 'seriesNumbers',
      key: 'seriesNumbers',      
      width: '10%',
      render: (seriesNumbers: ISeriesNumberRspModel[], record: ISingleCategoryRspModel) => <SeriesNumbersText record={record} seriesNumbers={seriesNumbers.map(c=>c.seriesNumbers)} />
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        <Button size='small' type="primary" onClick={() => handleSelect(record)}>编辑</Button>
      )
    }
  ]
  
  return (
    <>
      <Table 
        loading={loading}
        dataSource={currentCategories}
        pagination={{
          pageSize: 10
        }}
        rowKey={c=>c.id!}
        size='small'
        columns={columns} />
    </>    
  );
}
