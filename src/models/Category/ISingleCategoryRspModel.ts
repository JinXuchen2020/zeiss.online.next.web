import { ISeriesNumberRspModel } from ".";
import { ICategoryRspModel } from "./ICategoryRspModel";

export interface ISingleCategoryRspModel {
  id?: string,
  parent?: ICategoryRspModel,
  title: string,
  description: string,
  displayInFilter: boolean,
  sequence: number,
  seriesNumbers: ISeriesNumberRspModel[]
}