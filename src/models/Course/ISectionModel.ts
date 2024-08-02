import { ITagRspModel } from "models";
import { ISectionNodeModel } from "./ISectionNodeModel";

export interface ISectionModel {
  id?: string,
  courseId?: string,
  teacherId?: string,
  title : string,
  description: string,
  duration: number,
  sequence: number,
  contentLink: string,
  contentType: string,
  assetName: string,
  keywords?: string,
  nodes: ISectionNodeModel[]
  tags: ITagRspModel[]
}