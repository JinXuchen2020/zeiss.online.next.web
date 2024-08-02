import { Button } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { SeriesNumbersText } from "components";
import { IUserListRspModel, IUserRspModel } from "models";
import moment from "moment";
import React, { FunctionComponent } from "react";

export const UserTable: FunctionComponent<{
  currentUsers: IUserListRspModel | undefined;
  handlePageChange: any;
  currentPage: number;
  loading: boolean;
  handleSelect?: any;
}> = ({ currentUsers, currentPage, loading, handleSelect, handlePageChange }) => {
  const columns: ColumnsType<IUserRspModel> = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "手机",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ellipsis: true,
      width: 100,
      fixed: "left",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      width: 200,
    },
    {
      title: "单位",
      dataIndex: "company",
      key: "company",
      ellipsis: true,
      width: 150,
    },
    {
      title: "企业类型",
      dataIndex: "businessType",
      key: "businessType",
      ellipsis: true,
      width: 100,
      render: (value: any, record: IUserRspModel) => record.businessType?.name,
    },
    {
      title: "区域",
      dataIndex: "city",
      key: "city",
      ellipsis: true,
      width: 120,
      render: (value: any, record: IUserRspModel) =>
        record.province
          ? `${record.province?.name}/${record.city?.name}`
          : undefined,
    },
    {
      title: "行业",
      dataIndex: "industry",
      key: "industry",
      ellipsis: true,
      width: 120,
      render: (value: any, record: IUserRspModel) =>
        record.industry?.name ?? record.industryText,
    },
    {
      title: "职称",
      dataIndex: "jobTitle",
      key: "jobTitle",
      ellipsis: true,
      width: 100,
    },
    {
      title: "科室",
      dataIndex: "technicalOffice",
      key: "technicalOffice",
      ellipsis: true,
      width: 100,
    },
    {
      title: "部门",
      dataIndex: "department",
      key: "department",
      ellipsis: true,
      width: 100,
    },
    {
      title: "设备序列(SN)号",
      dataIndex: "seriesNumbers",
      key: "seriesNumbers",
      ellipsis: true,
      width: 100,
      render: (value: string, record: IUserRspModel) => (
        <SeriesNumbersText
          record={record}
          seriesNumbers={value ? value.split(",") : []}
        />
      ),
    },
    {
      title: "组长",
      dataIndex: "isMemberGroupLeader",
      key: "isMemberGroupLeader",
      ellipsis: true,
      width: 50,
      render: (value: boolean, record: IUserRspModel) => (value ? "是" : "否"),
    },
    {
      title: "注册时间",
      dataIndex: "registerDate",
      key: "registerDate",
      ellipsis: true,
      width: 100,
      render: (registerDate: Date) => moment(registerDate).format("YYYY-MM-DD"),
      sorter: (a, b) => compareDate(a, b),
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "descend",
    },
    {
      title: "",
      key: "action",
      width: handleSelect === undefined ? 0 : 100,
      fixed: "right",
      render: (text, record) =>
        handleSelect && (
          <Button
            size="small"
            disabled={record.isMemberGroupLeader}
            type="primary"
            onClick={() => handleSelect(record)}
          >
            设为组长
          </Button>
        ),
    },
  ];

  const compareDate = (a: IUserRspModel, b: IUserRspModel) => {
    const left = a.registerDate ? moment(a.registerDate).unix() : 0;
    const right = b.registerDate ? moment(b.registerDate).unix() : 0;
    return left - right;
  };

  return (
    <Table
      loading={loading}
      dataSource={currentUsers?.data}
      size={"small"}
      rowKey={(record) => record.id}
      pagination={{
        pageSize: 10,
        current: currentPage,
        onChange: (page, pageSize) => handlePageChange(page, pageSize),
        showSizeChanger: false,
        total: currentUsers?.total,
      }}
      scroll={{ x: 1300 }}
      columns={columns}
    />
  );
};
