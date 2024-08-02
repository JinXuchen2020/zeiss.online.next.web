import { IQuestionRspModel } from "./IQuestionRspModel";

export interface IQuestionGroupRspModel {
  id?: string,
  paperId?: string,
  name: string,
  selectedQuestionNumber: number,
  questions: IQuestionRspModel[]
};