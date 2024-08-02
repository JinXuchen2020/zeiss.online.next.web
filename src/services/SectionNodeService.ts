import { $fetch, IFetchProps } from "./BaseService"
import { ISectionNodeModel } from "models";

const Api = {
  getSectionNodes: (sectionId: string) => ({ method: "GET", url: `sections/${sectionId}/nodes` } as IFetchProps),
  addSectionNode: (sectionId: string, sectionNode: ISectionNodeModel) => ({ method: "POST", url: `sections/${sectionId}/nodes`, body: sectionNode } as IFetchProps),
  updateSectionNode: (sectionNodeId: string, sectionNode: ISectionNodeModel) => ({ method: "PUT", url: `sectionNodes/${sectionNodeId}`, body: sectionNode } as IFetchProps),
  deleteSectionNode: (id: string) => ({ method: "DELETE", url: `sectionNodes/${id}`} as IFetchProps),
}
  
export const SectionNodeService = {
  getSectionNodes: async (sectionId: string) => $fetch<ISectionNodeModel[]>(Api.getSectionNodes(sectionId)),
  addSectionNode: async (sectionId: string, sectionNode: ISectionNodeModel) => $fetch(Api.addSectionNode(sectionId, sectionNode)),
  updateSectionNode: async (sectionNodeId: string, sectionNode: ISectionNodeModel) => $fetch(Api.updateSectionNode(sectionNodeId, sectionNode)),
  deleteSectionNode: async (id: string) => $fetch(Api.deleteSectionNode(id)),
}