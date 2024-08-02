import { IQuestionReqModel } from ".";

export interface IQuestionGroupReqModel {
    paperId?: string,
    name: string,
    selectedQuestionNumber: number,
    questions: IQuestionReqModel[]
};