export interface IGroupStatusRspModel {
  id: string,
  name: string,
  courseCount: number,
  userCount: number,
  percent: string,
  completeUserCount: number,
  createdDate: string,
  createdBy: string
}