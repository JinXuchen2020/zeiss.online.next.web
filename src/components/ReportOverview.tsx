import { Card, Col, Divider, Row } from "antd";
import { ReportOverviewTable } from "components";
import { IReportOverviewRspModel } from "models";
import React, { FunctionComponent } from "react";

export const ReportOverview: FunctionComponent<{
  currentReportOverview: IReportOverviewRspModel | undefined;
  changeData?: any;
}> = ({ currentReportOverview, changeData }) => {
  return (
    <>
      <Row style={{ marginBottom: 20 }}>
        <Col span={5}>
          <Card className="report-card" bordered={false}>
            <p>{currentReportOverview?.registerCount ?? 0}</p>
            <p>注册人数</p>
          </Card>
        </Col>
        <Divider type="vertical" />
        <Col span={5}>
          <Card className="report-card" bordered={false}>
            <p>{currentReportOverview?.visitPersonCount ?? 0}</p>
            <p>访问人数</p>
          </Card>
        </Col>
        <Divider type="vertical" />
        <Col span={5}>
          <Card className="report-card" bordered={false}>
            <p>{currentReportOverview?.visitCount ?? 0}</p>
            <p>访问次数</p>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginBottom: 20 }}>
        <Col span={5}>
          <Card className="report-card" bordered={false}>
            <p>{currentReportOverview?.androidCount ?? 0}</p>
            <p>Andriod</p>
          </Card>
        </Col>
        <Divider type="vertical" />
        <Col span={5}>
          <Card className="report-card" bordered={false}>
            <p>{currentReportOverview?.iPhoneCount ?? 0}</p>
            <p>IPhone</p>
          </Card>
        </Col>
        <Divider type="vertical" />
        <Col span={5}>
          <Card className="report-card" bordered={false}>
            <p>{currentReportOverview?.otherDeviceCount ?? 0}</p>
            <p>PC访问小程序</p>
          </Card>
        </Col>
        <Divider type="vertical" />
        <Col span={5}>
          <Card className="report-card" bordered={false}>
            <p>{currentReportOverview?.pcCount ?? 0}</p>
            <p>H5</p>
          </Card>
        </Col>
      </Row>
      <Row style={{ minHeight: "500px" }}>
        <Col>
          <ReportOverviewTable
            currentReportDates={currentReportOverview?.dateDatas}
            loading={false}
          />
        </Col>
      </Row>
    </>
  );
};
