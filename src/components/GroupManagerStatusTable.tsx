import { Button, Table } from "antd";
import React, { FunctionComponent } from "react";
import { IGroupManagerStatusListRspModel, IGroupManagerStatusLiteRspModel } from "models";
import { ColumnsType } from "antd/lib/table";

export const GroupManagerStatusTable: FunctionComponent<{
  currentGroupManagers: IGroupManagerStatusListRspModel | undefined;
  handlePageChange: any;
  currentPage: number;
  loading: boolean;
  handleSelect: any;
}> = ({ currentGroupManagers, currentPage, loading, handleSelect, handlePageChange }) => {
  const columns: ColumnsType<IGroupManagerStatusLiteRspModel> = [
    {
      title: "组长",
      dataIndex: "name",
      key: "name",
      width: 80,
      ellipsis: true,
    },
    {
      title: "手机",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 100,
      ellipsis: true,
    },
    {
      title: "单位",
      dataIndex: "company",
      key: "company",
      width: 150,
      ellipsis: true,
    },
    {
      title: "学习小组",
      dataIndex: "groupCount",
      key: "groupCount",
      width: 80,
      ellipsis: true,
    },
    {
      title: "人数",
      dataIndex: "groupUserCount",
      key: "groupUserCount",
      ellipsis: true,
      width: 80,
    },
    {
      title: "完成全部课程人数",
      dataIndex: "completeUserCount",
      key: "completeUserCount",
      ellipsis: true,
      width: 140,
    },
    {
      title: "进度",
      dataIndex: "percent",
      key: "percent",
      ellipsis: true,
      width: 80,
    },
    {
      title: "邀请人",
      dataIndex: "createdBy",
      key: "createdBy",
      ellipsis: true,
      width: 80,
    },
    {
      title: "创建时间",
      dataIndex: "createdDate",
      key: "createdDate",
      ellipsis: true,
      width: 100,
    },
    {
      title: "",
      key: "action",
      width: 60,
      fixed: "right",
      render: (text, record) => (
        <Button
          size="small"
          type="primary"
          onClick={() => handleSelect(record)}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        size={"small"}
        loading={loading}
        dataSource={currentGroupManagers?.data}
        pagination={{
          pageSize: 10,
          current: currentPage,
          onChange: (page, pageSize) => handlePageChange(page, pageSize),
          showSizeChanger: false,
          total: currentGroupManagers?.total,
        }}
        rowKey={(c) => c.id!}
        scroll={{ x: 1000 }}
        columns={columns}
      />
    </>
  );
};
