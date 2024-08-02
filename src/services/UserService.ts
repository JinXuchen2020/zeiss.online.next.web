import { $fetch, IFetchProps, setErrorHandler } from "./BaseService"
import queryString from 'query-string';
import { IUserRspModel, IUserListRspModel, IUserHistoryRspModel, IUserQueryOption, IUserReqModel, IUserGroupReqModel, IUserGroupRspModel  } from "models";
import { message } from "antd";

const Api = {
  getUsers: (query: Partial<IUserQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'users', query: {...query}}) } as IFetchProps),
  getUser: (id: string) => ({ method: "GET", url: `users/${id}` } as IFetchProps),
  putUser: (id: string, user: IUserReqModel) => ({ method: "PUT", url: `users/${id}`, body: user } as IFetchProps),
  downloadUsers: (query: Partial<IUserQueryOption>) => ({ method: "DOWNLOAD", url: 'users/download', body: query } as IFetchProps),
  
  getUserGroups: (id: string) => ({ method: "GET", url:  `users/${id}/groups`} as IFetchProps),
  addUserGroup: (userGroup: IUserGroupReqModel) => ({ method: "POST", url:  `userGroups`, body: userGroup} as IFetchProps),
  getUserHistories: (id: string) => ({ method: "GET", url:  `users/${id}/history`} as IFetchProps),
}

export const UserService = {
  getUsers: async (query: Partial<IUserQueryOption>) => $fetch<IUserListRspModel>(Api.getUsers(query)),
  getUser: async (userId: string) => $fetch<IUserRspModel>(Api.getUser(userId)),
  putUser: async (userId: string, user: IUserReqModel) => $fetch(Api.putUser(userId, user)),
  downloadUsers: async (query: Partial<IUserQueryOption>) => $fetch<Blob>(Api.downloadUsers(query)),

  getUserGroups: async (userId: string) => $fetch<IUserGroupRspModel[]>(Api.getUserGroups(userId)),
  addUserGroup: async (userGroup: IUserGroupReqModel) => $fetch(Api.addUserGroup(userGroup)),
  getUserHistories: async (userId: string) => $fetch<IUserHistoryRspModel[]>(Api.getUserHistories(userId)),  

  setErrorHandler: () => {
    const handler : (err: any) => void = (err: any) => {
      message.error(err)
    }

    setErrorHandler(handler)
  } 
}
