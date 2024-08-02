import { ICourseRspModel, IUserRspModel } from "..";
export interface IGroupRspModel {
  id?: string,
  name: string,
  description: string,
  isDisabled: boolean,
  courses?: ICourseRspModel[]
  users: IUserRspModel[]
}