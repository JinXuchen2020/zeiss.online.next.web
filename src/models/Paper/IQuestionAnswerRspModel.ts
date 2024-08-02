import { IQuestionOptionRspModel } from "./IQuestionOptionRspModel";

export interface IQuestionAnswerRspModel {
  id?: string,
  questionId?: string,
  questionOption: IQuestionOptionRspModel,
};