import { IUserRspModel } from ".";

export interface IGroupUserRspModel {
  id: string,
  user: IUserRspModel,
  isMemberGroupLeader: boolean
}