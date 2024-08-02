import { $fetch, IFetchProps } from "./BaseService"
import queryString from 'query-string';
import { IGroupRspModel, IGroupManagerStatusRspModel, IGroupManagerReqModel, ICourseRspModel, IGroupManagerCourseReqModel, IUserQueryOption, IGroupManagerLiteRspModel, IGroupManagerStatusLiteRspModel, IGroupStatusRspModel, IGroupManagerStatusListRspModel } from "models";

const Api = { 
  getGroupManagers: (query: Partial<IUserQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'groupManagers', query: {...query}})} as IFetchProps),
  getGroupManagerStatus: (query: Partial<IUserQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'groupManagerStatus', query: {...query}})} as IFetchProps),
  getGroupManager: (id: string) => ({ method: "GET", url:  `groupManagers/${id}`} as IFetchProps),
  getGroupManagerStatusDetail: (id: string) => ({ method: "GET", url:  `groupManagerStatus/${id}`} as IFetchProps),
  addGroupManager: (groupManager: IGroupManagerReqModel) => ({ method: "POST", url: `groupManagers`, body: groupManager} as IFetchProps),
  updateGroupManager: (id: string, groupManager: IGroupManagerReqModel) => ({ method: "PUT", url: `groupManagers/${id}`, body: groupManager} as IFetchProps),
  deleteGroupManager: (id: string) => ({ method: "DELETE", url:  `groupManagers/${id}`} as IFetchProps),

  getGroupManagerCourses: (id: string) => ({ method: "GET", url: `groupManagers/${id}/courses`} as IFetchProps),
  getGroupCourses: (id: string) => ({ method: "GET", url: `groups/${id}/courses`} as IFetchProps),
  addGroupManagerCourse: (id: string, course: IGroupManagerCourseReqModel) => ({ method: "POST", url: `groupManagers/${id}/courses`, body: course} as IFetchProps),
  deleteGroupManagerCourse: (id: string, courseId: string) => ({ method: "DELETE", url: `groupManagers/${id}/courses/${courseId}`} as IFetchProps),

  validateCourse: (id: string, courseId: string) => ({ method: "GET", url: `groupManagers/${id}/courses/${courseId}/validator` } as IFetchProps),

  downloadGroupManagers: () => ({ method: "DOWNLOAD", url: 'groupManagers/download'} as IFetchProps),
}

export const GroupService = {
  getGroupManagers: async (query: Partial<IUserQueryOption>) => $fetch<IGroupManagerLiteRspModel[]>(Api.getGroupManagers(query)),
  getGroupManagerStatus: async (query: Partial<IUserQueryOption>) => $fetch<IGroupManagerStatusListRspModel>(Api.getGroupManagerStatus(query)),
  getGroupManager: async (id: string) => $fetch<IGroupManagerStatusRspModel>(Api.getGroupManager(id)),
  getGroupManagerStatusDetail: async (id: string) => $fetch<IGroupStatusRspModel>(Api.getGroupManagerStatusDetail(id)),
  addGroupManager: async (groupManager: IGroupManagerReqModel) => $fetch(Api.addGroupManager(groupManager)),
  updateGroupManager: async (id: string, groupManager: IGroupManagerReqModel) => $fetch(Api.updateGroupManager(id, groupManager)),
  deleteGroupManager: async (groupManagerId: string) => $fetch(Api.deleteGroupManager(groupManagerId)),

  getGroupManagerCourses: async (groupManagerId: string) => $fetch<ICourseRspModel[]>(Api.getGroupManagerCourses(groupManagerId)),
  getGroupCourses: async (groupId: string) => $fetch<ICourseRspModel[]>(Api.getGroupCourses(groupId)),
  addGroupManagerCourse: async (groupManagerId: string, course: IGroupManagerCourseReqModel) => $fetch(Api.addGroupManagerCourse(groupManagerId, course)),
  deleteGroupManagerCourse: async (groupManagerId: string, courseId: string) => $fetch(Api.deleteGroupManagerCourse(groupManagerId, courseId)),

  validateCourse: async (groupManagerId: string, courseId: string) => $fetch<IGroupRspModel[]>(Api.validateCourse(groupManagerId, courseId)),

  downloadGroupManagers: async () => $fetch<Blob>(Api.downloadGroupManagers()),
}
