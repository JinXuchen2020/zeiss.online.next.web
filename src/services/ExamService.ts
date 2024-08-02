import { $fetch, IFetchProps } from "./BaseService"
import queryString from 'query-string';
import { IQuestionListRspModel, IQuestionQueryOption, IQuestionReqModel, IQuestionRspModel } from "models";

const Api = {
    getExams: (query: Partial<IQuestionQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'questions', query: {...query}}) } as IFetchProps),
    getExam: (id: string) => ({ method: "GET", url: `questions/${id}` } as IFetchProps),
    postExam: (question: IQuestionReqModel) => ({ method: "POST", url: "questions", body: question } as IFetchProps),
    deleteExam: (questionId: string) => ({ method: "DELETE", url: `questions/${questionId}` } as IFetchProps),
    putExam: (id: string, question: IQuestionReqModel) => ({ method: "PUT", url: `questions/${id}`, body: question } as IFetchProps),
    downloadTemplate:(questions: IQuestionRspModel[]) => ({ method: "DOWNLOAD", url: `questions/template`, body: questions } as IFetchProps),
    importQuestions:(file: FormData) => ({ method: "POSTFILES", url: `questions/import`, body: file } as IFetchProps),
}

export const ExamService = {
    getQuestions: async (query: Partial<IQuestionQueryOption>) => $fetch<IQuestionListRspModel>(Api.getExams(query)),
    getQuestion: async (questionId: string) => $fetch<IQuestionRspModel>(Api.getExam(questionId)),
    postQuestion: async (question: IQuestionReqModel) => $fetch(Api.postExam(question)),
    deleteQuestion: async (questionId: string) => $fetch(Api.deleteExam(questionId)),
    putQuestion: async (questionId: string, question: IQuestionReqModel) => $fetch(Api.putExam(questionId, question)),

    downloadTemplate: async (questions: IQuestionRspModel[]) => $fetch<Blob>(Api.downloadTemplate(questions)),
    importQuestions:async (file: FormData) => $fetch<IQuestionRspModel[]>(Api.importQuestions(file)),
}
