import { $fetch, IFetchProps } from "./BaseService"
import queryString from 'query-string';
import { IWeChatMessageModel, IWeChatMessageResponseModel, IWeChatSignatureModel, IWeChatUserModel } from "models";

const Api = {
  getWeChatSignature: (url: string) => ({ method: "GET", url: queryString.stringifyUrl({url: `jssdk/signature`, query: {url}}) } as IFetchProps),
  getWeChatUser: (userId: string) => ({ method: "GET", url: queryString.stringifyUrl({url: `user/get`, query: {userId}}) } as IFetchProps),
  sendMessage: (message: IWeChatMessageModel) => ({ method: "POST", url:  `sendMessage`, body: message} as IFetchProps),
}

export const WeComService = {
  getWeChatSignature: async (url: string) => $fetch<IWeChatSignatureModel>(Api.getWeChatSignature(url)),
  getWeChatUser: async (userId: string) => $fetch<IWeChatUserModel>(Api.getWeChatUser(userId)),
  sendMessage: async (message: IWeChatMessageModel) => $fetch<IWeChatMessageResponseModel>(Api.sendMessage(message)), 
}
