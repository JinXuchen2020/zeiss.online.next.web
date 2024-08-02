import { IQuestionOptionReqModel } from ".";

export interface IQuestionReqModel {
    questionGroupId?: string,
    stem: string,
    type: string,
    level: string,
    questionOptions: IQuestionOptionReqModel[]
};