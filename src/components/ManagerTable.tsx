import { Button } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import { IEnterpriseUserRspModel, IRoleRspModel } from 'models';
import React, { FunctionComponent } from 'react';

export const ManagerTable : FunctionComponent<{currentManagers: IEnterpriseUserRspModel[] | undefined, loading: boolean, handleSelect?: any}> 
= ({currentManagers, loading, handleSelect}) => {
  const columns : ColumnsType<IEnterpriseUserRspModel> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: '15%',
    },
    {
      title: '模块',
      dataIndex: 'managementModules',
      key: 'managementModules',
      ellipsis: true,
      width: '15%',
      render: (value: IRoleRspModel[]) => value.map(c=>c.name).join(", ")
    },
    {
      title: '',
      key: 'action',
      width: '10%',
      render: (text, record) => (
        handleSelect && <Button size='small' type="primary" onClick={()=> handleSelect(record)}>编辑</Button>
      )
    }
  ]

  return (
    <Table 
      loading={loading}
      dataSource={currentManagers}
      size={'small'}
      rowKey={record => record.id!} 
      columns={columns} />
  );
}
