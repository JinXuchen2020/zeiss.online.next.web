import { IGroupManagerRspModel, IGroupStatusRspModel } from ".";

export interface IGroupManagerStatusRspModel {
  manager: IGroupManagerRspModel,
  groups: IGroupStatusRspModel[],
}