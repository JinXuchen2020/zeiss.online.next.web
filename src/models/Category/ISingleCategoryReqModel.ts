import { ISeriesNumberReqModel } from ".";

export interface ISingleCategoryReqModel {
  parent_Id?: string,
  title: string,
  description: string,
  displayInFilter: boolean,
  sequence: number,
  seriesNumbers: ISeriesNumberReqModel[]
}