import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { IReportDateOverviewRspModel } from "models";
import { IListRsp } from "models/IListRsp";
import moment from "moment";
import { FunctionComponent } from "react";

export const ReportOverviewTable: FunctionComponent<{
  currentReportDates: IListRsp<IReportDateOverviewRspModel> | undefined;
  handlePageChange?: any;
  loading: boolean;
  handleSelect?: any;
}> = ({ currentReportDates, loading, handlePageChange, handleSelect }) => {
  const columns: ColumnsType<IReportDateOverviewRspModel> = [
    {
      title: "日期",
      dataIndex: "dateTimeKey",
      key: "dateTimeKey",
      ellipsis: true,
      width: 100,
      render: (value: number) => {
        return moment(value.toString(), "YYYYMMDD").format("YYYY/MM/DD");
      },
      sorter: (a, b) => a.dateTimeKey - b.dateTimeKey,
      sortDirections: ["ascend", "descend", "ascend"],
      defaultSortOrder: "descend",
    },
    {
      title: "注册人数",
      dataIndex: "registerCount",
      key: "registerCount",
      ellipsis: true,
      width: 100,
    },
    {
      title: "访问人数",
      dataIndex: "visitPersonCount",
      key: "visitPersonCount",
      width: 100,
      ellipsis: true,
    },
    {
      title: "访问次数",
      dataIndex: "visitCount",
      key: "visitCount",
      width: 100,
      ellipsis: true,
    },
    {
      title: "转发",
      dataIndex: "shareCount",
      key: "shareCount",
      width: 100,
      ellipsis: true,
    },
    {
      title: "收藏",
      dataIndex: "collectionCount",
      key: "collectionCount",
      width: 100,
    },
    {
      title: "完成（考试）",
      dataIndex: "passExamCount",
      key: "passExamCount",
      ellipsis: true,
      width: 100,
    },
  ];

  return (
    <Table
      loading={loading}
      dataSource={currentReportDates?.data}
      size={"small"}
      rowKey={(record) => record.dateTimeKey}
      scroll={{ x: 1000 }}
      columns={columns}
    />
  );
};
