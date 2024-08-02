import { IQuestionGroupRspModel } from "..";

export interface IPaperRspModel {
  id?: string,
  courseId?: string,
  title: string,
  description: string,
  totalQuestionNumber: number,
  passedQuestionNumber: number,
  questionGroups: IQuestionGroupRspModel[]
};