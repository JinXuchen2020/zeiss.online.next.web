import { ITagRspModel } from ".";

export interface ITagGroupRspModel {
  id?: string,
  name: string,
  displayInFilter: boolean
  tags: ITagRspModel[],
}