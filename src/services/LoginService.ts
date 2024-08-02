import { $fetch, IFetchProps } from "./BaseService"
import queryString from 'query-string';
import { ITokenRspModel, IWeChatUserModel } from "../models";

const Api = {
  loginWithWeChatCode: (code: string) => ({ method: "GET", url: queryString.stringifyUrl({url: 'userToken/code', query: {code}}) } as IFetchProps),
  loginWithWeChatUser: (user: IWeChatUserModel) => ({ method: "POST", url: 'userToken/user', body: user } as IFetchProps),
  loginWithPhoneNumber: (phoneNumber: string) => ({ method: "GET", url: queryString.stringifyUrl({url: 'userToken/phoneNumber', query: {phoneNumber}}) } as IFetchProps),
}

export const LoginService = {
  loginWithWeChatCode: async (code: string) => $fetch<ITokenRspModel>(Api.loginWithWeChatCode(code)),
  loginWithWeChatUser: async (user: IWeChatUserModel) => $fetch<ITokenRspModel>(Api.loginWithWeChatUser(user)),
  loginWithPhoneNumber: async (phoneNumber: string) => $fetch<ITokenRspModel>(Api.loginWithPhoneNumber(phoneNumber))
}