export interface IWeChatMessageModel {
  touser?: string,
  msgtype: string,
  agentid: number,
  text: IWeChatMessageContentModel
}

export interface IWeChatMessageResponseModel {
  msgid: string,
  errorCode: string,
  errorMsg: string
}

interface IWeChatMessageContentModel {
  content: string
}