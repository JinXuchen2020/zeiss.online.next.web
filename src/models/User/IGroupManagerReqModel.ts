import { IGroupManagerCourseReqModel } from ".";

export interface IGroupManagerReqModel {
  userId: string,
  comment: string,
  courses: IGroupManagerCourseReqModel[]
}