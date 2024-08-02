export interface ICategoryRspModel {
  id?: string,
  parent_Id?: string,
  title: string,
  description: string,
  displayInFilter: boolean,
  sequence: number,
  children?:ICategoryRspModel[]
}