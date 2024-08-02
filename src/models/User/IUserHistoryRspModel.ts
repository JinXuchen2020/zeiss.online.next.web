export interface IUserHistoryRspModel {
  id: string,
  userId: string,
  sectionId: string,
  sectionNodeId?: string,
  watchedTime: number,
  isCompleted: boolean
}