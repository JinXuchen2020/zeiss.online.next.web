import {WeComService} from "services"

const redirect = process.env.REACT_APP_WE_CHAT_REDIRECT_URI
const corpId = process.env.REACT_APP_WE_CHAT_CORP_ID
const agentId = process.env.REACT_APP_WE_CHAT_AGENT_ID
export const configAndReady = (apiList, resolve, reject) => {
  let url = redirect;
  if(!redirect.endsWith("/")) {
    url = redirect + "/"
  }
  WeComService.getWeChatSignature(url).then((rsp)=> {
    window.wx.config({
      beta: true,
      debug: false,
      appId: corpId,
      timestamp: rsp.timestamp,
      nonceStr: rsp.noncestr,
      signature: rsp.signature,
      jsApiList: apiList
    });

    window.wx.ready(() => resolve());

    window.wx.error((error) => reject(error));
  })
}

export const agentConfig = (apiList, resolve, reject) => {
  WeComService.getWeChatSignature(redirect).then((rsp)=> {
    window.wx.agentConfig({
      corpid: corpId,
      agentid: agentId,
      timestamp: rsp.timestamp,
      nonceStr: rsp.noncestr,
      signature: rsp.signature,
      jsApiList: apiList,
      success: res => resolve(res),
      fail: error => {
        reject(error);
      },
    })
  })
}

export const selectEnterpriseContact = (resolve) => {
  const param = {
    fromDepartmentId: -1,
    mode: 'single',
    type: ["user"]
  }
  window.wx.invoke('selectEnterpriseContact', param, 
    res => resolve(res)
  )
}