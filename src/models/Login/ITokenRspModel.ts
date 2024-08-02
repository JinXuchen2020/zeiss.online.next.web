import { IEnterpriseUserRspModel } from "models";
export interface ITokenRspModel {
  id: string,
  code: number,
  message: string,
  token: string,
  user: IEnterpriseUserRspModel,
  timestamp: number
}