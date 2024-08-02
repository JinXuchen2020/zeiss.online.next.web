import React, { useState, useEffect } from "react";
import { Button, Col, DatePicker, Form, Row, Space, Tabs } from "antd";
import { CourseService } from "services";
import {
  IReportRspModel,
  IDateTimeOption,
  IReportOverviewRspModel,
  ICourseProgressRspModel,
} from "models";
import {
  CourseProgressTable,
  Loading,
  ReportOverview,
  ReportTable,
} from "components";
import moment from "moment";
import fileDownload from "js-file-download";
import { LeftOutlined } from "@ant-design/icons";

export type Flag = "Base" | "Progress";
export const Reports: React.FunctionComponent = () => {
  const [reportModels, setReportModels] = useState<IReportRspModel[]>();

  const [reportModel, setReportModel] = useState<IReportRspModel>();

  const [reportOverviewModel, setReportOverviewModel] =
    useState<IReportOverviewRspModel>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>();
  const [activeKey, setActiveKey] = useState("1");

  const [pageFlag, setPageFlag] = useState<Flag>("Base");

  const [courseProgress, setCourseProgress] =
    useState<ICourseProgressRspModel[]>();

  const [dateTimeOption, setDateTimeOption] = useState<IDateTimeOption>({});

  const [form] = Form.useForm();

  const timeValidator = (rule: any, value: any, callback: any) => {
    if (dateTimeOption) {
      if (
        dateTimeOption.startTime &&
        dateTimeOption.endTime &&
        moment(dateTimeOption.startTime) > moment(dateTimeOption.endTime)
      ) {
        callback("开始时间不能大于结束时间!");
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  const handleActiveTab = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  const handleBack = () => {
    setPageFlag("Base");
  };

  const backBtnLabel = () => {
    if (pageFlag === "Progress") {
      return `${reportModel?.name}课程学习进度`;
    }
  };

  const handleSearch = async () => {
    if (dateTimeOption) {
      if (dateTimeOption.endTime === undefined) {
        dateTimeOption.endTime = moment().format("YYYY-MM-DD");
      }
      form.validateFields().then(() => {
        if (activeKey === "1") {
          refreshReportOverview(dateTimeOption);
        } else {
          refreshReportDetail(dateTimeOption);
        }
      });
    }
  };

  const handleReset = async () => {
    const defaultTimeOption: IDateTimeOption = {
      startTime: undefined,
      endTime: undefined,
    };
    form.setFieldsValue(defaultTimeOption);
    if (activeKey === "1") {
      refreshReportOverview(defaultTimeOption);
    } else {
      refreshReportDetail(defaultTimeOption);
    }

    setDateTimeOption(defaultTimeOption);
  };

  const handleDownload = () => {
    if (dateTimeOption) {
      if (dateTimeOption.endTime === undefined) {
        dateTimeOption.endTime = moment().format("YYYY-MM-DD");
      }
      form.validateFields().then(() => {
        CourseService.downloadCourseReports(dateTimeOption).then((rsp) => {
          if (rsp) {
            fileDownload(rsp, "课程报告.xlsx");
          }
        });
      });
    }
  };

  const showCourseProgress = (report: IReportRspModel) => {
    setPageFlag("Progress");
    setReportModel(report);
    loadingCourseProgress(report.id);
  };

  const loadingCourseProgress = (id: string) => {
    setIsLoading(true);
    setLoadingTip("加载课程进度...");
    CourseService.getCourseProgress(id).then((rsp) => {
      if (rsp && rsp instanceof Array) {
        setCourseProgress(rsp);
      }

      setIsLoading(false);
    });
  };

  const refreshReportDetail = (query: IDateTimeOption) => {
    setIsLoading(true);
    setLoadingTip("加载报告详情...");
    CourseService.getCourseReports(query).then((rsp) => {
      if (rsp && rsp instanceof Array) {
        setReportModels([...rsp]);
      }
      setIsLoading(false);
    });
  };

  const refreshReportOverview = (query: IDateTimeOption) => {
    setIsLoading(true);
    setLoadingTip("加载报告总览...");
    CourseService.getCourseReportOverview(query).then((rsp) => {
      if (rsp) {
        CourseService.getCourseReportSubOverview(query).then((subOverview) => {
          rsp.dateDatas = subOverview;
          setReportOverviewModel(rsp);
          setIsLoading(false);
        });
      }
      else {
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    if (activeKey === "1") {
      refreshReportOverview(dateTimeOption);
    } else {
      refreshReportDetail(dateTimeOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      <Row style={{ marginTop: 10 }}>
        <Col offset={1} span={22}>
          {pageFlag === "Progress" ? (
            <Row>
              <Col span={24}>
                <Row gutter={24}>
                  <Col span={6}>
                    <Button
                      type="text"
                      icon={<LeftOutlined />}
                      onClick={handleBack}
                    >
                      {backBtnLabel()}
                    </Button>
                  </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col offset={1} span={22}>
                    <CourseProgressTable
                      currentCourseProgress={courseProgress}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          ) : (
            <>
              <Row>
                <Col span={24}>
                  <Form form={form} layout={"inline"}>
                    <Form.Item
                      label={"开始时间"}
                      name={"startTime"}
                      rules={[{ validator: timeValidator }]}
                    >
                      <DatePicker
                        placeholder="请选择时间"
                        value={
                          dateTimeOption?.startTime
                            ? moment(dateTimeOption.startTime)
                            : undefined
                        }
                        disabledDate={(currentDate: any) =>
                          currentDate > moment(new Date())
                        }
                        onChange={(value) =>
                          setDateTimeOption({
                            ...dateTimeOption,
                            startTime: value?.format("YYYY-MM-DD"),
                          })
                        }
                      />
                    </Form.Item>
                    <Form.Item label={"结束时间"} name={"endTime"}>
                      <DatePicker
                        placeholder="请选择时间"
                        value={
                          dateTimeOption?.endTime
                            ? moment(dateTimeOption?.endTime)
                            : undefined
                        }
                        disabledDate={(currentDate: any) =>
                          currentDate < moment(dateTimeOption?.startTime) ||
                          currentDate > moment(new Date())
                        }
                        onChange={(value) =>
                          setDateTimeOption({
                            ...dateTimeOption,
                            endTime: value?.format("YYYY-MM-DD"),
                          })
                        }
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={handleSearch}>
                        搜索
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" onClick={handleReset}>
                        重置
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col>
                  <Tabs activeKey={activeKey} onChange={handleActiveTab}>
                    <Tabs.TabPane tab="总览" key="1">
                      <Row>
                        <Col span={24}>
                          <ReportOverview
                            currentReportOverview={reportOverviewModel}
                          />
                        </Col>
                      </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="报告详情" key="2">
                      <Row gutter={24} style={{ marginBottom: 10 }}>
                        <Col span={24}>
                          <Space style={{ float: "right" }}>
                            <Button type="primary" onClick={handleDownload}>
                              下载数据
                            </Button>
                          </Space>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <ReportTable
                            handleSelect={showCourseProgress}
                            currentReports={reportModels}
                            loading={false}
                          />
                        </Col>
                      </Row>
                    </Tabs.TabPane>
                  </Tabs>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};
