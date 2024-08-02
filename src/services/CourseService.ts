import { $fetch, IFetchProps } from "./BaseService"
import queryString from 'query-string';
import { IDateTimeOption, IReportRspModel, IAssetRspModel, ICategoryRspModel, ICourseListRspModel, ICourseProgressRspModel, ICourseQueryOption, ICourseReqModel, ICourseRspModel, IPaperReqModel, IPaperRspModel, IQuestionRspModel, ITagRspModel, IReportOverviewRspModel, IReportDateOverviewRspModel } from "models";
import { IListRsp } from "models/IListRsp";

const Api = {
  getCourses: (query: Partial<ICourseQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'course', query: {...query}}) } as IFetchProps),
  getPublishCourses: (query: Partial<ICourseQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'publishCourses', query: {...query}}) } as IFetchProps),
  getCourse: (id: string) => ({ method: "GET", url: `course/${id}` } as IFetchProps),
  deleteCourse: (courseId: string) => ({ method: "DELETE", url: `course/${courseId}` } as IFetchProps),
  postCourse: (course: ICourseReqModel) => ({ method: "POST", url: "course", body: course } as IFetchProps),
  putCourse: (courseId: string, course: ICourseReqModel) => ({ method: "PUT", url: `course/${courseId}`, body: course } as IFetchProps),
  validateCourse: (courseName: string) => ({ method: "GET", url: queryString.stringifyUrl({url: 'course/validator', query: {courseName}}) } as IFetchProps),
  validateCourseById: (courseId: string) => ({ method: "GET", url: `course/${courseId}/validator` } as IFetchProps),
  downloadTemplate: (courseIds: string[]) => ({ method: "DOWNLOAD", url: `course/export`, body: courseIds } as IFetchProps),
  importCourses: (file: FormData) => ({ method: "POSTFILES", url: `course/import`, body: file } as IFetchProps),
  
  getCourseQuestions: (courseId: string) => ({ method: "GET", url: `course/${courseId}/question` } as IFetchProps),
  postCourseQuestions: (courseId: string, questionIds: string[]) => ({ method: "POST", url: `course/${courseId}/question`, body: questionIds } as IFetchProps),
  deleteCourseQuestion: (courseId: string, questionId: string) => ({ method: "DELETE", url: `course/${courseId}/question/${questionId}` } as IFetchProps),
  importCourseQuestions:(file: FormData, courseId: string) => ({ method: "POSTFILES", url: `course/${courseId}/question/import`, body: file } as IFetchProps),

  getCoursePaper: (courseId: string) => ({ method: "GET", url: `courses/${courseId}/papers` } as IFetchProps),
  getPaper: (paperId: string) => ({ method: "GET", url: `papers/${paperId}` } as IFetchProps),
  postCoursePaper: (courseId: string, paper: IPaperReqModel) => ({ method: "POST", url: `courses/${courseId}/papers`, body: paper } as IFetchProps),
  putCoursePaper: (paperId: string, paper: IPaperReqModel) => ({ method: "PUT", url: `papers/${paperId}`, body: paper } as IFetchProps),
  deleteCoursePaper: (paperId: string) => ({ method: "DELETE", url: `papers/${paperId}` } as IFetchProps),
  
  getCourseTags: (courseId: string) => ({ method: "GET", url: `course/${courseId}/tags` } as IFetchProps),
  addCourseTag: (courseId: string, tagId: string) => ({ method: "POST", url: `course/${courseId}/tags`, body: tagId } as IFetchProps),
  deleteCourseTag: (courseId: string, tagId: string) => ({ method: "DELETE", url: `course/${courseId}/tags/${tagId}`} as IFetchProps),

  getCourseCategories: (courseId: string) => ({ method: "GET", url: `course/${courseId}/categories` } as IFetchProps),
  addCourseCategory: (courseId: string, categoryId: string) => ({ method: "POST", url: `course/${courseId}/categories`, body: categoryId } as IFetchProps),
  deleteCourseCategory: (courseId: string, categoryId: string) => ({ method: "DELETE", url: `course/${courseId}/categories/${categoryId}`} as IFetchProps),

  getCourseImages: (courseId: string) => ({ method: "GET", url: `course/${courseId}/images` } as IFetchProps),

  getCourseProgress: (courseId: string) => ({method: "GET", url: `course/${courseId}/progress`} as IFetchProps),

  getCourseReports: (timeRange: IDateTimeOption) => ({method: "POST", url: `course/reports`, body: timeRange} as IFetchProps),
  downloadCourseReports: (timeRange: IDateTimeOption) => ({method: "DOWNLOAD", url: `course/reports/download`, body: timeRange} as IFetchProps),
  getCourseReportOverview: (timeRange: IDateTimeOption) => ({method: "GET", url: queryString.stringifyUrl({url: `course/reports/overview`, query: {...timeRange}})} as IFetchProps),
  getCourseReportSubOverview: (timeRange: IDateTimeOption) => ({method: "GET", url: queryString.stringifyUrl({url: `course/reports/subOverview`, query: {...timeRange}})} as IFetchProps),

  copyCourseCompleteSections: (courseId: string, newCourseName: string) => ({method: "POST", url: `course/${courseId}/copyCompletedSections`, body: newCourseName} as IFetchProps),
}

export const CourseService = {
  getCourses: async (query: Partial<ICourseQueryOption>) => $fetch<ICourseListRspModel>(Api.getCourses(query)),
  getPublishCourses: async (query: Partial<ICourseQueryOption>) => $fetch<ICourseListRspModel>(Api.getPublishCourses(query)),
  getCourse: async (courseId: string) => $fetch<ICourseRspModel>(Api.getCourse(courseId)),
  deleteCourse: async (courseId: string) => $fetch(Api.deleteCourse(courseId)),
  postCourse: async (course: ICourseReqModel) => $fetch(Api.postCourse(course)),
  putCourse: async (courseId: string, course: ICourseReqModel) => $fetch(Api.putCourse(courseId, course)),
  validateCourse: async (courseName: string) => $fetch<string>(Api.validateCourse(courseName)),
  validateCourseById: async (courseId: string) => $fetch<boolean>(Api.validateCourseById(courseId)),
  
  downloadTemplate: async (courseIds: string[]) => $fetch<Blob>(Api.downloadTemplate(courseIds)),
  importCourses: async (file: FormData) =>$fetch(Api.importCourses(file)),

  getCourseQuestions: async (courseId: string) => $fetch<IQuestionRspModel[]>(Api.getCourseQuestions(courseId)),
  postCourseQuestions: async (courseId: string, questionIds: string[]) => $fetch<IQuestionRspModel[]>(Api.postCourseQuestions(courseId, questionIds)),
  importCourseQuestions:async (file: FormData, courseId: string) => $fetch(Api.importCourseQuestions(file, courseId)),
  deleteCourseQuestion: async (courseId: string, questionId: string) => $fetch(Api.deleteCourseQuestion(courseId, questionId)),

  getCoursePaper: async (courseId: string) => $fetch<IPaperRspModel>(Api.getCoursePaper(courseId)),
  getPaper: async (paperId: string) => $fetch<IPaperRspModel>(Api.getPaper(paperId)),
  postCoursePaper: async (courseId: string, paper: IPaperReqModel) => $fetch(Api.postCoursePaper(courseId, paper)),
  putCoursePaper: async (paperId: string, paper: IPaperReqModel) => $fetch(Api.putCoursePaper(paperId, paper)),
  deleteCoursePaper: async (paperId: string) => $fetch(Api.deleteCoursePaper(paperId)),
  
  getCourseTags: async (courseId: string) => $fetch<ITagRspModel[]>(Api.getCourseTags(courseId)),
  addCourseTag: async (courseId: string, tagId: string) => $fetch(Api.addCourseTag(courseId, tagId)),
  deleteCourseTag: async (courseId: string, tagId: string) => $fetch(Api.deleteCourseTag(courseId, tagId)),

  getCourseCategories: async (courseId: string) => $fetch<ICategoryRspModel[]>(Api.getCourseCategories(courseId)),
  addCourseCategory: async (courseId: string, categoryId: string) => $fetch(Api.addCourseCategory(courseId, categoryId)),
  deleteCourseCategory: async (courseId: string, categoryId: string) => $fetch(Api.deleteCourseCategory(courseId, categoryId)),

  getCourseImages: async (courseId: string) => $fetch<IAssetRspModel[]>(Api.getCourseImages(courseId)),

  getCourseProgress: async (courseId: string) => $fetch<ICourseProgressRspModel[]>(Api.getCourseProgress(courseId)),

  getCourseReports: async (timeRange: IDateTimeOption) => $fetch<IReportRspModel[]>(Api.getCourseReports(timeRange)),
  getCourseReportOverview: async (timeRange: IDateTimeOption) => $fetch<IReportOverviewRspModel>(Api.getCourseReportOverview(timeRange)),
  getCourseReportSubOverview: async (timeRange: IDateTimeOption) => $fetch<IListRsp<IReportDateOverviewRspModel>>(Api.getCourseReportSubOverview(timeRange)),
  downloadCourseReports: async (timeRange: IDateTimeOption) => $fetch<Blob>(Api.downloadCourseReports(timeRange)),

  copyCourseCompleteSections: async (courseId: string, newCourseName: string) => $fetch(Api.copyCourseCompleteSections(courseId, newCourseName)),
}