import { $fetch, IFetchProps } from "./BaseService"
import { ITagGroupListRspModel, ITagGroupReqModel, ITagRspModel, ITagReqModel, ITagQueryOption, ITagListRspModel } from "models";
import queryString from 'query-string';

const Api = {  
  getTagGroups: (query: Partial<ITagQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'tagGroups', query: {...query}}) } as IFetchProps),
  addTagGroup: (tagGroup: ITagGroupReqModel) => ({ method: "POST", url: `tagGroups`, body: tagGroup } as IFetchProps),
  putTagGroup: (groupId: string, tagGroup: ITagGroupReqModel) => ({ method: "PUT", url: `tagGroups/${groupId}`, body: tagGroup } as IFetchProps),
  deleteTagGroup: (groupId: string) => ({ method: "DELETE", url: `tagGroups/${groupId}`} as IFetchProps),
  
  getGroupTags: (id:string) => ({ method: "GET", url: `tagGroups/${id}/tags` } as IFetchProps),
  getTags: (query: Partial<ITagQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'tags', query: {...query}}) } as IFetchProps),

  addTag: (groupId: string, tag: ITagReqModel) => ({ method: "POST", url: `tagGroups/${groupId}/tags`, body: tag } as IFetchProps),
  updateTag: (tagId: string, tag: ITagReqModel) => ({ method: "PUT", url: `tags/${tagId}`, body: tag } as IFetchProps),
  deleteTag: (tagId: string) => ({ method: "DELETE", url: `tags/${tagId}`} as IFetchProps),
}
  
export const TagService = {
  getTagGroups: async (query: Partial<ITagQueryOption>) => $fetch<ITagGroupListRspModel>(Api.getTagGroups(query)),

  addTagGroup: async (tagGroup: ITagGroupReqModel) => $fetch(Api.addTagGroup(tagGroup)),
  updateTagGroup: async (groupId: string, tagGroup: ITagGroupReqModel) => $fetch(Api.putTagGroup(groupId, tagGroup)),
  deleteTagGroup: async (groupId: string) => $fetch(Api.deleteTagGroup(groupId)),

  getTags: async (query: Partial<ITagQueryOption>) => $fetch<ITagListRspModel>(Api.getTags(query)),
  getGroupTags: async (groupId:string) => $fetch<ITagRspModel[]>(Api.getGroupTags(groupId)),

  addTag: async (groupId:string, tag: ITagReqModel) => $fetch<ITagRspModel>(Api.addTag(groupId, tag)),
  updateTag: async (tagId:string, tag: ITagReqModel) => $fetch<ITagRspModel>(Api.updateTag(tagId, tag)),
  deleteTag: async (tagId: string) => $fetch(Api.deleteTag(tagId)),
}