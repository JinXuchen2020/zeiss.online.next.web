import { Button, Col, Row, Space, Tabs } from "antd";
import {
  GroupManagerStatusTable,
  GroupManagerTable,
  GroupStatusTable,
  Loading,
  TableSearch,
} from "components";
import {
  IGroupManagerLiteRspModel,
  IGroupManagerStatusListRspModel,
  IGroupManagerStatusLiteRspModel,
  IGroupStatusRspModel,
  IUserQueryOption,
} from "models";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GroupService } from "services";
import { LeftOutlined } from "@ant-design/icons";
import fileDownload from "js-file-download";
import queryString from "query-string";

const { TabPane } = Tabs;
export const GroupsV2: FunctionComponent = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [groupManagers, setGroupManagers] =
    useState<IGroupManagerLiteRspModel[]>();

  const [groupManagerStatus, setGroupManagerStatus] =
    useState<IGroupManagerStatusListRspModel>();

  const [currentPage, setCurrentPage] = useState(1);

  const changeManagerStatus = async (page: number, pageSize: number) => {
    setCurrentPage(page);
  };

  const [currentManagerStatus, setCurrentManagerStatus] =
    useState<IGroupManagerStatusLiteRspModel>();

  const [groupStatus, setGroupStatus] = useState<IGroupStatusRspModel[]>();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>();

  const [showGroupStatus, setShowGroupStatus] = useState(false);

  const [activeKey, setActiveKey] = useState("1");

  const handleActiveTab = (activeKey: string) => {
    setActiveKey(activeKey);
  };

  const handleManageLeader = (groupManager: IGroupManagerLiteRspModel) => {
    navigate(`/groups/${groupManager.id}`);
  };

  const handleCreate = () => {
    navigate(`/groups/create`);
  };

  const handleDownload = () => {
    GroupService.downloadGroupManagers().then((rsp) => {
      if (rsp) {
        fileDownload(rsp, "组长使用情况.xlsx");
      }
    });
  };

  const showManagerGroupStatus = (
    groupManager: IGroupManagerStatusLiteRspModel
  ) => {
    setCurrentManagerStatus(groupManager);
    setIsLoading(true);
    setLoadingTip("加载使用详情...");
    GroupService.getGroupManagerStatusDetail(groupManager.id).then((rsp) => {
      if (rsp && rsp instanceof Array) {
        setGroupStatus(rsp);
      }

      setIsLoading(false);
      setShowGroupStatus(true);
    });
  };

  const refreshGroupManagers = (query: Partial<IUserQueryOption>) => {
    setIsLoading(true);
    setLoadingTip("加载组长...");
    GroupService.getGroupManagers(query).then((rsp) => {
      if (rsp && rsp instanceof Array) {
        setGroupManagers(rsp);
      }

      setIsLoading(false);
    });
  };

  const refreshGroupManagerStatus = (query: Partial<IUserQueryOption>) => {
    setIsLoading(true);
    setLoadingTip("加载使用情况...");
    GroupService.getGroupManagerStatus(query).then((rsp) => {
      if (rsp && rsp.data instanceof Array) {
        setGroupManagerStatus(rsp);
      }

      setIsLoading(false);
    });
  };

  useEffect(() => {
    const query: Partial<IUserQueryOption> = queryString.parse(
      searchParams.toString()
    );
    if (activeKey === "1") {
      refreshGroupManagers(query);
    } else if (activeKey === "2") {
      query.pageNo = currentPage
      query.pageSize= 10
      refreshGroupManagerStatus(query);
    }
  }, [searchParams, activeKey, currentPage]);

  useEffect(() => {}, [activeKey]);

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />
      {showGroupStatus ? (
        <Row>
          <Col span={24}>
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={() => setShowGroupStatus(false)}
            >{`${currentManagerStatus?.name}的学习小组情况`}</Button>
            <Row style={{ marginTop: 10 }}>
              <Col offset={1} span={22}>
                <GroupStatusTable currentGroups={groupStatus} loading={false} />
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row style={{ marginTop: 10 }}>
          <Col offset={1} span={22}>
            <Tabs activeKey={activeKey} onChange={handleActiveTab}>
              <TabPane tab="组长" key="1">
                <Row gutter={24} style={{ marginBottom: 10 }}>
                  <Col span={18}>
                    <TableSearch
                      optionKey={"phoneNumber"}
                      placeholder={"请输入手机号码"}
                      buttonText={"查找"}
                    />
                  </Col>
                  <Col span={6}>
                    <Space style={{ float: "right" }}>
                      <Button type="primary" onClick={handleCreate}>
                        新建组长
                      </Button>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <GroupManagerTable
                      currentGroupManagers={groupManagers}
                      loading={false}
                      handleSelect={handleManageLeader}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="使用情况" key="2">
                <Row gutter={24} style={{ marginBottom: 10 }}>
                  <Col span={18}>
                    <TableSearch
                      optionKey={"phoneNumber"}
                      placeholder={"请输入手机号码"}
                      buttonText={"查找"}
                    />
                  </Col>
                  <Col span={6}>
                    <Space style={{ float: "right" }}>
                      <Button type="primary" onClick={handleDownload}>
                        下载数据
                      </Button>
                    </Space>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <GroupManagerStatusTable
                      currentGroupManagers={groupManagerStatus}
                      loading={false}
                      handleSelect={showManagerGroupStatus}
                      handlePageChange={changeManagerStatus}
                      currentPage={currentPage}
                    />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      )}
    </>
  );
};
