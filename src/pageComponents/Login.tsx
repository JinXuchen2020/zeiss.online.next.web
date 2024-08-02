import { Button, Form, Input, message, Space, Col, Row } from 'antd';
import { USER_PROFILE } from 'models';
import React, { FunctionComponent, useState } from 'react';
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import { LoginService } from 'services';

export const Login : FunctionComponent = () => {
  const [form] = Form.useForm();
  const navigate = useRouter();
  const [scanCodeLogin, setScanCodeLogin] = useState<Boolean>(false);

  const appId = process.env.NEXT_PUBLIC_WE_CHAT_CORP_ID;
  const agentId = process.env.NEXT_PUBLIC_WE_CHAT_AGENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_WE_CHAT_REDIRECT_URI;

  const currentService = LoginService;

  const handleLogin = () => {
    form.validateFields().then((format: any) => {
      currentService.loginWithPhoneNumber(format.id).then(result => {
        if(result.code > 0) {
          result.timestamp = new Date().getTime()
          sessionStorage.setItem(USER_PROFILE, JSON.stringify(result));
          navigate.push('/'); // should home
        }
        else {
          message.warning(result.message)
        }
      })
    });
  }

  const handleScanCodeLogin = () => {
    setScanCodeLogin(true);
  }

  const handleAccountLogin = () => {
    setScanCodeLogin(false);
  }

  return (
    <div className='preview-result' style={{textAlign: 'left'}}>
      <Row>
        <Col style={{textAlign: 'center'}} span={24}>
          <Image alt="logo" src={'assets/images/zeiss.png'} height={65} width={65} />
        </Col>
      </Row>
      {!scanCodeLogin &&
        <Form
          form={form}
          name='login'
          labelCol={{span: 9}}
          wrapperCol={{span: 7}}
          layout={'horizontal'}
          onFinish={handleLogin}
        >
          <Form.Item label='账号' name='id' rules={[{ required: !scanCodeLogin, message: '请输入微信号' }]}>
            <Input placeholder='请输入微信号'/>
          </Form.Item>
          <Form.Item label='密码' name='password' rules={[{ required: !scanCodeLogin, message: '请输入密码' }]}>
            <Input type='password' placeholder='请输入密码'/>
          </Form.Item>
          <Form.Item wrapperCol={{span: 24}} style={{textAlign:'center'}}>
            <Space>
              <Button type='primary' htmlType='submit'>登陆</Button>
            </Space>
          </Form.Item>
        </Form>
      }
      {
        !scanCodeLogin && 
        <Row>
          <Col style={{textAlign: 'center'}} span={24}>
            <Button type='link' onClick={handleScanCodeLogin}>扫描二维码</Button>
          </Col>
        </Row>
      }
      {
        scanCodeLogin &&
        <Row>
          <Col style={{textAlign: 'center'}} span={24}>
            <div id='codeArea'>
              <iframe title='login' frameBorder='0' sandbox='allow-scripts allow-same-origin allow-top-navigation' scrolling='no'  
              src={`https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${appId}&agentid=${agentId}&redirect_uri=${redirectUri}&state=STATE&lang=zh`} height='400'></iframe>
            </div>
          </Col>
        </Row>
      }
      {
        scanCodeLogin &&
        <Row>
          <Col style={{textAlign: 'center'}} span={24}>
            <Button type='link' onClick={handleAccountLogin}>使用账号登陆</Button>
          </Col>
        </Row>
      }
    </div>
  )
}
