import { ISectionTagReqModel } from ".";
import { ISectionNodeModel } from "./ISectionNodeModel";

export interface ISectionReqModel {
  courseId?: string,
  teacherId?: string,
  title : string,
  description: string,
  duration: number,
  sequence: number,
  contentLink: string,
  contentType: string,
  assetName: string,
  nodes: ISectionNodeModel[],
  sectionTags?: ISectionTagReqModel[],
  keywords?: string
}