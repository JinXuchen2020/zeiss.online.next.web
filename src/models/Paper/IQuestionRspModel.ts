import { IQuestionOptionRspModel } from "./IQuestionOptionRspModel";

export interface IQuestionRspModel {
    id?: string,
    questionGroupId?: string,
    stem: string,
    type: string,
    level: string,
    questionOptions: IQuestionOptionRspModel[]
};