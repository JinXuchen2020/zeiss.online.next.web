import { ICourseRspModel } from "models";
import { IUserRspModel } from ".";

export interface IGroupManagerRspModel {
  id?: string,
  user: IUserRspModel,
  comment: string,
  courses: ICourseRspModel[],
  createdDate?: Date,
  createdBy?: IUserRspModel
}