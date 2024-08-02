import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import '../styles/Main.css';
import { Layout, Menu, MenuProps, Tooltip } from 'antd';
import { useNavigate, Outlet, useSearchParams } from 'react-router-dom'
import { MenuInfo, MenuClickEventHandler }  from 'rc-menu/lib/interface'
import { ConfirmModal, HeaderCtl } from 'components';
import { useLocation } from 'react-router';
import { IEnterpriseUserRspModel, ITokenRspModel, USER_PROFILE, isWxBrowser, isWxWorkBrowser } from 'models';
import moment from 'moment';
import queryString from 'query-string';
import { configAndReady } from 'models/WeComConfig';
import { LoginService } from 'services';

const { Header, Content, Sider } = Layout;

export const Main : FunctionComponent = () => {
  let navigate = useNavigate();    
  const [searchParams, ] = useSearchParams();
  const location = useLocation();

  const [activeKey, setActiveKey] = useState<string>();

  const [userModel, setUserModel] = useState<IEnterpriseUserRspModel>();

  const [userTokenString, setUserTokenString] = useState<string>();

  const selectMenu : MenuClickEventHandler = (info: MenuInfo) =>{
    navigate(info.key);
  }

  useEffect(() => {
    const key = location.pathname.substring(1).split("/")[0];
    setActiveKey(key)
  }, [location.pathname])

  useEffect(() => {
    const tokenString = sessionStorage.getItem(USER_PROFILE)
    if(tokenString) {
      setUserTokenString(tokenString)
    }
    else {
      const { code } = queryString.parse(searchParams.toString())
      if(code) {
        LoginService.loginWithWeChatCode(code as string).then(result => {
          if(result.code > 0) {
            sessionStorage.setItem(USER_PROFILE, JSON.stringify(result));
            navigate('/')
          }
          else {
            ConfirmModal({
              title: <Tooltip title={result.message}>登录失败</Tooltip>,
              confirm: () => navigate('/login')
            })
          }
        })
      }
      else {
        const index = window.location.pathname.indexOf('/', 1)
        if(index >= 0) {
          const originPath = window.location.pathname.substring(index)
          sessionStorage.setItem("OriginPath", originPath)
        }

        if(isWxWorkBrowser()) {
          navigate('/authorize')
        }
        else {
          navigate('/login')
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[searchParams])

  useEffect(() => {    
    if(userTokenString) {
      const userToken = JSON.parse(userTokenString) as ITokenRspModel
      const timeout = moment.unix(5 * 60 * 60 * 1000).unix();
      const isTimeOut = new Date().getTime() - userToken.timestamp > timeout
      if(isTimeOut) {
        const index = window.location.pathname.indexOf('/', 1)
        if(index >= 0) {
          const originPath = window.location.pathname.substring(index)
          sessionStorage.setItem("OriginPath", originPath)
        }
        sessionStorage.removeItem(USER_PROFILE)
        if(isWxWorkBrowser()) {
          navigate('/authorize')
        }
        else {
          navigate('/login')
        }
      }
      else {
        if(userModel === undefined) {
          setUserModel(userToken.user)
          if(isWxBrowser()) {
            configAndReady(
              ["selectEnterpriseContact"],
              () => {
                console.log("注入config成功")
              }, 
              (error: any) => {
                console.log("注入config失败"  + error)
              }
            )
          }

          const originPath = sessionStorage.getItem("OriginPath")
          if(originPath) {
            navigate(originPath)
            sessionStorage.removeItem("OriginPath")
          }
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTokenString]);

  type MenuItem = Required<MenuProps>['items'][number];
  const items: MenuItem[] = useMemo(() => {
    if (userModel?.managementModules) {
      const result = userModel.managementModules.sort((a, b) => a.sequence - b.sequence).map(c=> (
        {
          key: c.key,
          label: c.name,
        } as MenuItem
      ));

      result.push({
        key: "employeeUsers",
        label: "员工账号"
      });

      return result;
    }
    else {
      return []
    }
  },[userModel?.managementModules])
  
  return (
    <Layout>
      <Header className="site-layout-background">
        <HeaderCtl currentUser={userModel} />
      </Header>
      <Layout>
        <Sider 
          breakpoint="lg"
          collapsedWidth="0" 
          width={120} 
          className="site-layout-background"
        >
          {
            userModel && <> 
            {
              userModel.managementModules.length > 0 ? 
              <Menu
                mode="inline"
                onClick ={selectMenu}
                activeKey={activeKey}
                selectedKeys={[activeKey!]}
                style={{ height: '100%', borderRight: 0, textAlign: 'center' }}
                items={items}
              /> : ConfirmModal({ title: "请联系管理员申请相关权限！"})
            }</> 
          }
        </Sider>
        <Layout style={{ padding: '14px' }}>
          <Content
            className="site-layout-background"
            onScroll={(e) => {              
              sessionStorage.setItem("scrollTop", e.currentTarget.scrollTop.toString());
            }}
            style={{
              padding: 14,
              margin: 0,
              overflow: 'auto',
              height: 'calc(100vh - 130px)',
            }}
          > 
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
