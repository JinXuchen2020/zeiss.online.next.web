import { IRoleRspModel } from ".";

export interface IEnterpriseUserRspModel {
  id?: string,
  userId: string,
  name: string,
  phoneNumber?: string,
  departmentId?: number,
  email?: string,
  weChatImagePath?: string,
  managementModules: IRoleRspModel[],
}