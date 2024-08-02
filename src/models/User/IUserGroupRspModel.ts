import { IGroupRspModel } from ".";

export interface IUserGroupRspModel {
  id: string,
  memberGroup: IGroupRspModel,
  isMemberGroupLeader: boolean
}