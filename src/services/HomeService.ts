import { $fetch, IFetchProps } from "./BaseService"
import { IBannerCourseReqModel, IBannerCourseRspModel, IHotCourseReqModel, IHotCourseRspModel, IQuickSearchReqModel, IQuickSearchRspModel } from "models";

const Api = {  
  getBanners: () => ({ method: "GET", url: `banners` } as IFetchProps),
  getBanner: (id: string) => ({ method: "GET", url: `banners/${id}` } as IFetchProps),
  updateBanner: (id: string, input: IBannerCourseReqModel) => ({ method: "PUT", url: `banners/${id}`, body: input } as IFetchProps),
  addBanner: (input: IBannerCourseReqModel) => ({ method: "POST", url: `banners`, body: input } as IFetchProps),
  deleteBanner: (id: string) => ({ method: "DELETE", url: `banners/${id}` } as IFetchProps),

  getHotCourses: () => ({ method: "GET", url: `hotCourses` } as IFetchProps),
  getHotCourse: (id: string) => ({ method: "GET", url: `hotCourses/${id}` } as IFetchProps),
  updateHotCourse: (id: string, input: IHotCourseReqModel) => ({ method: "PUT", url: `hotCourses/${id}`, body: input } as IFetchProps),
  addHotCourse: (input: IHotCourseReqModel) => ({ method: "POST", url: `hotCourses`, body: input } as IFetchProps),
  deleteHotCourse: (id: string) => ({ method: "DELETE", url: `hotCourses/${id}` } as IFetchProps),

  getQuickSearchConfig: () => ({ method: "GET", url: `quickSearches` } as IFetchProps),
  deleteQuickSearchConfig: (id: string) => ({ method: "DELETE", url: `quickSearches/${id}` } as IFetchProps),
  addQuickSearchConfig: (quickSearch: IQuickSearchReqModel) => ({ method: "POST", url: `quickSearches`, body: quickSearch } as IFetchProps),
  updateQuickSearchConfig: (id: string, quickSearch: IQuickSearchReqModel) => ({ method: "PUT", url: `quickSearches/${id}`, body: quickSearch } as IFetchProps),
}
  
export const HomeService = {
  getBanners: async () => $fetch<IBannerCourseRspModel[]>(Api.getBanners()),
  getBanner: async (id: string) => $fetch<IBannerCourseRspModel>(Api.getBanner(id)),
  updateBanner: async (id: string, banner: IBannerCourseReqModel) => $fetch(Api.updateBanner(id, banner)),
  addBanner: async (banner: IBannerCourseReqModel) => $fetch(Api.addBanner(banner)),
  deleteBanner: async (id: string) => $fetch(Api.deleteBanner(id)),

  getHotCourses: async () => $fetch<IHotCourseRspModel[]>(Api.getHotCourses()),
  getHotCourse: async (id: string) => $fetch<IHotCourseRspModel>(Api.getHotCourse(id)),
  updateHotCourse: async (id: string, banner: IHotCourseReqModel) => $fetch(Api.updateHotCourse(id, banner)),
  addHotCourse: async (banner: IHotCourseReqModel) => $fetch(Api.addHotCourse(banner)),
  deleteHotCourse: async (id: string) => $fetch(Api.deleteHotCourse(id)),

  getQuickSearchConfig: async () => $fetch<IQuickSearchRspModel[]>(Api.getQuickSearchConfig()),
  deleteQuickSearchConfig: async (id: string) => $fetch<IQuickSearchRspModel[]>(Api.deleteQuickSearchConfig(id)),
  addQuickSearchConfig: async (quickSearch: IQuickSearchReqModel) => $fetch<IQuickSearchRspModel[]>(Api.addQuickSearchConfig(quickSearch)),
  updateQuickSearchConfig: async (id: string, quickSearch: IQuickSearchReqModel) => $fetch<IQuickSearchRspModel[]>(Api.updateQuickSearchConfig(id, quickSearch)),
}