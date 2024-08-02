import { IQuestionGroupReqModel } from ".";

export interface IPaperReqModel {
  courseId?: string,
  title: string,
  description: string,
  imageLibraryId?: string,
  totalQuestionNumber: number,
  passedQuestionNumber: number,
  questionGroups?: IQuestionGroupReqModel[]
};