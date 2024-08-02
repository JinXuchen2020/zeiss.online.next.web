import { IUserRoleReqModel } from ".";

export interface IEnterpriseUserReqModel {
  userId: string,
  name: string,
  phoneNumber?: string,
  departmentId?: number,
  email?: string,
  weChatImagePath?: string,
  managementModules: IUserRoleReqModel[],
}