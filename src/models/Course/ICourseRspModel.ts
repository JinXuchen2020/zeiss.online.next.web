import { ICategoryRspModel, IAssetRspModel, IQuestionRspModel, IPaperRspModel, IUserRspModel } from "..";
import { ISectionModel } from "./ISectionModel";
import { ITagRspModel } from "../Tag/ITagRspModel";

export interface ICourseRspModel {
  id?: string,
  name: string,
  fullName: string,
  description: string,
  duration: number,
  points: number,
  level: number,
  isHot: boolean,
  isPublished?: boolean,
  categories?: ICategoryRspModel[],
  coverImage?: IAssetRspModel,
  categoryRootName?: string,
  keywords?: string,
  tags: ITagRspModel[],
  sections: ISectionModel[],
  questions?: IQuestionRspModel[],
  paper?: IPaperRspModel,
  feedBackLink?: string,
  sequence: number,
  createdDate?: Date,
  createdBy?: IUserRspModel,
  modifiedDate?: Date,
  modifiedBy?: IUserRspModel,
  publishedBy?: IUserRspModel,
  publishedDate?: Date
};