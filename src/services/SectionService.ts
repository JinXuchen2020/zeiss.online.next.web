import { $fetch, IFetchProps, setErrorHandler } from "./BaseService"
import queryString from 'query-string';
import { IBigAssetRspModel, ISectionModel, IAssetRspModel, IVideoRspModel, ITagRspModel, ISectionReqModel, IAssetQueryOption } from "models";

const Api = {
  getSections: (courseId: string) => ({ method: "GET", url: `course/${courseId}/sections` } as IFetchProps),
  addSection: (courseId: string, section: ISectionReqModel) => ({ method: "POST", url: `course/${courseId}/sections`, body: section } as IFetchProps),
  updateSection: (id: string, section: ISectionReqModel) => ({ method: "PUT", url: `sections/${id}`, body: section } as IFetchProps),
  deleteSection: (id: string) => ({ method: "DELETE", url: `sections/${id}` } as IFetchProps),

  uploadVideo: (file: FormData) => ({ method: "POSTFILES", url: `video`, body: file } as IFetchProps),
  getVideoProgress: (fileName: string, type: string) => ({ method: "GET", url: queryString.stringifyUrl({url: `videoUploadProgress`, query: {fileName, type}}) } as IFetchProps),
  getVideoUploadStatus: (fileName: string) => ({ method: "GET", url: queryString.stringifyUrl({url: `videoUploadStatus`, query: {fileName}}) } as IFetchProps),
  updateVideoUploadStatus: (fileName: string) => ({ method: "POST", url: `videoUploadStatus`, body: fileName } as IFetchProps),
  getEncryptedVideo: (assetName: string) => ({ method: "GET", url: `video/${assetName}.m3u8` } as IFetchProps),
  getVideoState: (assetName: string, fileName: string, type: string) => ({ method: "GET", url: queryString.stringifyUrl({url: `video/${assetName}/state`, query: {fileName, type}}) } as IFetchProps),
  getVideos: (query: Partial<IAssetQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'video', query: {...query}}) } as IFetchProps),
  getVideo: (assetName: string) => ({ method: "GET", url: `video/${assetName}` } as IFetchProps),

  getSectionTags: (sectionId: string) => ({ method: "GET", url: `sections/${sectionId}/tags` } as IFetchProps),
  addSectionTag: (sectionId: string, tagId: string) => ({ method: "POST", url: `sections/${sectionId}/tags`, body: tagId } as IFetchProps),
  deleteSectionTag: (sectionId: string, tagId: string) => ({ method: "DELETE", url: `sections/${sectionId}/tags/${tagId}`} as IFetchProps),
}

export const SectionService = {
  getSections: async (courseId: string) => $fetch<ISectionModel[]>(Api.getSections(courseId)),
  addSection: async (courseId: string, section: ISectionReqModel) => $fetch(Api.addSection(courseId, section)),
  updateSection: async (id: string, section: ISectionReqModel) => $fetch(Api.updateSection(id, section)),
  deleteSection: async (id: string) => $fetch(Api.deleteSection(id)),

  uploadVideo: async (file: FormData) => $fetch<IBigAssetRspModel>(Api.uploadVideo(file)),
  getVideoProgress: async (fileName: string, type: string) => $fetch<IBigAssetRspModel>(Api.getVideoProgress(fileName, type)),
  getVideoUploadStatus: async (fileName: string) => $fetch<boolean>(Api.getVideoUploadStatus(fileName)),
  updateVideoUploadStatus: async (fileName: string) => $fetch(Api.updateVideoUploadStatus(fileName)),
  getEncryptedVideo: async (assetName: string) => $fetch<IVideoRspModel>(Api.getEncryptedVideo(assetName)),
  getVideoState: async (assetName: string, fileName: string, type: string) => $fetch<IBigAssetRspModel>(Api.getVideoState(assetName, fileName, type)),
  getVideos: async (query: Partial<IAssetQueryOption>) => $fetch<IAssetRspModel[]>(Api.getVideos(query)),
  getVideo: async (assetName: string) => $fetch<IAssetRspModel>(Api.getVideo(assetName)),

  getSectionTags: async (sectionId: string) => $fetch<ITagRspModel[]>(Api.getSectionTags(sectionId)),
  addSectionTag: async (sectionId: string, tagId: string) => $fetch(Api.addSectionTag(sectionId, tagId)),
  deleteSectionTag: async (sectionId: string, tagId: string) => $fetch(Api.deleteSectionTag(sectionId, tagId)),

  setErrorHandler: (handler: (err: any) => void) => {
    setErrorHandler(handler)
  }
}