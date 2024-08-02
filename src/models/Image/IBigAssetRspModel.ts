import { IAssetRspModel } from ".";

export interface IBigAssetRspModel {
  percent: number,
  data?: IAssetRspModel,
  message: string
}