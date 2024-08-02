import { $fetch, IFetchProps } from "./BaseService"
import queryString from 'query-string'
import { ICategoryQueryOption, ICategoryReqModel, ICategoryRspModel, ISeriesNumberReqModel, ISeriesNumberRspModel, ISingleCategoryReqModel, ISingleCategoryRspModel } from "models";

const Api = {  
  getCategories: () => ({ method: "GET", url: `category` } as IFetchProps),
  createCategory: (category: ICategoryReqModel) => ({ method: "POST", url: `category`, body: category } as IFetchProps),
  updateCategory: (id: string, category: ICategoryReqModel) => ({ method: "PUT", url: `category/${id}`, body: category } as IFetchProps),
  deleteCategory: (id: string) => ({ method: "DELETE", url: `category/${id}` } as IFetchProps),

  getSeriesNumbers: (categoryId: string) => ({ method: "GET", url: `category/${categoryId}/seriesNumbers` } as IFetchProps),
  addSeriesNumber: (categoryId: string, input: ISeriesNumberReqModel) => ({ method: "POST", url: `category/${categoryId}/seriesNumbers`, body: input } as IFetchProps),
  updateSeriesNumber: (id: string, input: ISeriesNumberReqModel) => ({ method: "PUT", url: `seriesNumbers/${id}`, body: input } as IFetchProps),
  deleteSeriesNumber: (id: string) => ({ method: "DELETE", url: `seriesNumbers/${id}` } as IFetchProps),

  getSingleCategories: (query: Partial<ICategoryQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'singleCategories', query: {...query}}) } as IFetchProps),
  createSingleCategory: (input: ISingleCategoryReqModel) => ({ method: "POST", url: `singleCategories`, body: input } as IFetchProps),
  getRootCategories: () => ({ method: "GET", url: `rootCategories` } as IFetchProps),
  validateRootCategory: (categoryId: string) => ({ method: "GET", url: `category/${categoryId}/validator` } as IFetchProps),
}
  
export const CategoryService = {
  getCategories: async () => $fetch<ICategoryRspModel[]>(Api.getCategories()),
  createCategory: async (category: ICategoryReqModel) => $fetch<ICategoryRspModel>(Api.createCategory(category)),
  updateCategory: async (id: string, category: ICategoryReqModel) => $fetch(Api.updateCategory(id, category)),
  deleteCategory: async (id: string) => $fetch(Api.deleteCategory(id)),

  getSingleCategories: async (query: Partial<ICategoryQueryOption>) => $fetch<ISingleCategoryRspModel[]>(Api.getSingleCategories(query)),
  createSingleCategory: async (input: ISingleCategoryReqModel) => $fetch(Api.createSingleCategory(input)),
  getRootCategories: async () => $fetch<ICategoryRspModel[]>(Api.getRootCategories()),
  validateRootCategory: async (categoryId: string) => $fetch<boolean>(Api.validateRootCategory(categoryId)),

  getSeriesNumbers: async (categoryId: string) => $fetch<ISeriesNumberRspModel[]>(Api.getSeriesNumbers(categoryId)), 
  addSeriesNumber: async (categoryId: string, input: ISeriesNumberReqModel) => $fetch(Api.addSeriesNumber(categoryId, input)),
  updateSeriesNumber: async (id: string, input: ISeriesNumberReqModel) => $fetch(Api.updateSeriesNumber(id, input)),
  deleteSeriesNumber: async (id: string) => $fetch(Api.deleteSeriesNumber(id)),
}