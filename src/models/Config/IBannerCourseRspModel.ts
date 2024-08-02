import { IAssetRspModel } from "models";
import { ICourseRspModel } from "../Course";

export interface IBannerCourseRspModel {
  id?: string,
  course?: ICourseRspModel,
  imageLibrary?: IAssetRspModel,
  sequence: number,
  isValid: boolean,
}