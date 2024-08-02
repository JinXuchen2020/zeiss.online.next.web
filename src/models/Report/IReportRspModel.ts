export interface IReportRspModel {
  id: string,
  name: string,
  tags: string,
  isPublished?: boolean,
  publishedBy: string,
  publishedDate: Date,
  browserCount: number,
  hits: number,
  shareCount: number,
  collectionCount : number,
  completedCount: number
}