import { ICourseRspModel } from "../Course";

export interface IHotCourseRspModel {
  id?: string,
  course?: ICourseRspModel,
  sequence: number,
}