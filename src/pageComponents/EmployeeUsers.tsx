import React, { useState, useEffect } from 'react';
import { Col, Empty, Row } from 'antd';
import { ManagerService } from 'services';
import { IEmployeeUserReqModel, IEmployeeUserRspModel, ITokenRspModel, USER_PROFILE } from 'models';
import { ConfirmModal, EmployeeUserTable, Loading } from 'components';
import moment from 'moment';

export const EmployeeUsers: React.FunctionComponent = () => {
  const [employeeUserModels, setEmployeeUserModels] = useState<IEmployeeUserRspModel[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState<string>()

  const getUserModel = () => {
    const tokenString = sessionStorage.getItem(USER_PROFILE)!
    const userToken = JSON.parse(tokenString) as ITokenRspModel
    return userToken.user
  } 

  const userModel = getUserModel(); 

  const refresh = () => {
    setIsLoading(true);
    setLoadingTip("加载员工账号...")
    ManagerService.getEmployeeUsers(userModel.id!).then(rsp => {
      if(rsp && rsp instanceof Array) {
        setEmployeeUserModels([...rsp]);
      }
      setIsLoading(false);
    });
  }

  const handleSelect = (employee: IEmployeeUserRspModel) => {
    const input : IEmployeeUserReqModel = {
      userId: employee.userId,
      expirationDate: new Date()
    }
    setIsLoading(true);
    setLoadingTip("激活账号中...")
    if(employee.id) {
      ManagerService.reativateEmployeeUser(employee.id, input).then(() => {
        setIsLoading(false);
        ConfirmModal({
          title: `账号已激活, 有效期至${moment(input.expirationDate).add({month: 1}).format('YYYY年MM月DD日')}`
        })

        refresh()
      });
    }
    else {
      ManagerService.activateEmployeeUser(input).then(() => {
        setIsLoading(false);
        ConfirmModal({
          title: `账号已激活, 有效期至${moment(input.expirationDate).add({month: 1}).format('YYYY年MM月DD日')}`
        })
        refresh()
      });
    }
  }

  useEffect(() => {
    refresh()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userModel.id]);

  return (
    <>
      <Loading loading={isLoading} spinTip={loadingTip} />     
      <Row style={{marginTop: 10}}>
        <Col offset={1} span={22}>
          <Row style={{marginTop: 10}}>
            <Col> 
              <EmployeeUserTable 
                currentEmployees={employeeUserModels} 
                emptyNode={<Empty description={`没有找到符合您公司邮箱(${userModel.email})的小程序注册用户, 您可以在小程序的个人中心中修改您的注册邮箱。`}></Empty>}
                handleSelect={handleSelect} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
