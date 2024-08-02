import { $fetch, IFetchProps, setErrorHandler } from "./BaseService"
import { IQuestionGroupReqModel, IQuestionGroupRspModel, IQuestionOptionReqModel, IQuestionOptionRspModel, IQuestionReqModel, IQuestionRspModel } from "models";

const Api = {
  getQuestionGroups: (paperId: string)  => ({ method: "GET", url: `papers/${paperId}/questionGroups`} as IFetchProps),
  createQuestionGroup: (paperId: string, questionGroup: IQuestionGroupReqModel)  => ({ method: "POST", url: `papers/${paperId}/questionGroups`, body: questionGroup } as IFetchProps),
  updateQuestionGroup: (questionGroupId: string, questionGroup: IQuestionGroupReqModel)  => ({ method: "PUT", url: `questionGroups/${questionGroupId}`, body: questionGroup } as IFetchProps),
  deleteQuestionGroup: (questionGroupId: string) => ({ method: "DELETE", url: `questionGroups/${questionGroupId}` } as IFetchProps),

  createQuestion: (questionGroupId: string, question: IQuestionReqModel)  => ({ method: "POST", url: `questionGroups/${questionGroupId}/questions`, body: question } as IFetchProps),
  updateQuestion: (questionId: string, question: IQuestionReqModel)  => ({ method: "PUT", url: `questions/${questionId}`, body: question } as IFetchProps),
  deleteQuestion: (questionId: string) => ({ method: "DELETE", url: `questions/${questionId}` } as IFetchProps),

  getQuestionOptions: (questionId: string)  => ({ method: "GET", url: `questions/${questionId}/options`} as IFetchProps),
  createQuestionOption: (questionId: string, questionOption: IQuestionOptionReqModel) => ({ method: "POST", url: `questions/${questionId}/options`, body: questionOption } as IFetchProps),
  updateQuestionOption: (questionOptionId: string, questionOption: IQuestionOptionReqModel) => ({ method: "PUT", url: `questionOptions/${questionOptionId}`, body: questionOption } as IFetchProps),
  deleteQuestionOption: (questionOptionId: string) => ({ method: "DELETE", url: `questionOptions/${questionOptionId}` } as IFetchProps),

  downloadQuestions: (paperId?: string)  => ({ method: "DOWNLOAD", url: `questionGroups/download`, body: {paperId: paperId}} as IFetchProps),
  importQuestions: (file: FormData)  => ({ method: "POSTFILES", url: `questionGroups/import`, body: file } as IFetchProps),
}

export const PaperService = {

  getQuestionGroups: async (paperId: string) => $fetch<IQuestionGroupRspModel[]>(Api.getQuestionGroups(paperId)),

  downloadQuestions: async (paperId?: string) => $fetch<Blob>(Api.downloadQuestions(paperId)),
  importQuestions: async (file: FormData) => $fetch<IQuestionGroupRspModel[]>(Api.importQuestions(file)),

  createQuestionGroup: async (paperId: string, questionGroup: IQuestionGroupReqModel) => $fetch<IQuestionGroupRspModel>(Api.createQuestionGroup(paperId, questionGroup)),
  updateQuestionGroup: async (questionGroupId: string, questionGroup: IQuestionGroupReqModel) => $fetch(Api.updateQuestionGroup(questionGroupId, questionGroup)),
  deleteQuestionGroup: async (questionGroupId: string) => $fetch(Api.deleteQuestionGroup(questionGroupId)),

  createQuestion: async (questionGroupId: string, question: IQuestionReqModel) => $fetch<IQuestionRspModel>(Api.createQuestion(questionGroupId, question)),
  updateQuestion: async (questionId: string, question: IQuestionReqModel) => $fetch(Api.updateQuestion(questionId, question)),
  deleteQuestion: async (questionId: string) => $fetch(Api.deleteQuestion(questionId)),
  getQuestionOptions: async (questionId: string) => $fetch<IQuestionOptionRspModel[]>(Api.getQuestionOptions(questionId)),

  createQuestionOption: async (questionId: string, questionOption: IQuestionOptionReqModel) => $fetch<IQuestionOptionRspModel>(Api.createQuestionOption(questionId, questionOption)),
  updateQuestionOption: async (questionOptionId: string, questionOption: IQuestionOptionReqModel) => $fetch(Api.updateQuestionOption(questionOptionId, questionOption)),
  deleteQuestionOption: async (questionOptionId: string) => $fetch(Api.deleteQuestionOption(questionOptionId)),

  setErrorHandler: (handler: (err: any) => void) => {
    setErrorHandler(handler)
  }
}
