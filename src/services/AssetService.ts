import { $fetch, IFetchProps } from "./BaseService"
import { IAssetQueryOption, IAssetRspModel } from "models";
import queryString from 'query-string';

const Api = {
  getImageUrls: (query: Partial<IAssetQueryOption>) => ({ method: "GET", url: queryString.stringifyUrl({url: 'image', query: {...query}}) } as IFetchProps),
  postImage: (file: FormData) => ({ method: "POSTFILES", url: `images`, body: file } as IFetchProps),
}

export const AssetService = {
  getImages: async (query: Partial<IAssetQueryOption>) => $fetch<IAssetRspModel[]>(Api.getImageUrls(query)),
  postImage: async (file: FormData) => $fetch<IAssetRspModel[]>(Api.postImage(file))
}