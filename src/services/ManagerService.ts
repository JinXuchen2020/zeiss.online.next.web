import { $fetch, IFetchProps } from "./BaseService"
import { IEmployeeUserReqModel, IEmployeeUserRspModel, IEnterpriseUserReqModel, IEnterpriseUserRspModel, IRoleRspModel, IUserRoleReqModel, IWeChatDepartmentRspModel, IWeChatUserModel } from "models";

const Api = {  
  getManagers: () => ({ method: "GET", url: `enterpriseUsers` } as IFetchProps),

  getWeChatDepartments: () => ({ method: "GET", url: `departments` } as IFetchProps),
  getWeChatUsers: (departmentId: number) => ({ method: "GET", url: `departments/${departmentId}/users` } as IFetchProps),

  getRoles: () => ({ method: "GET", url: `managementModules` } as IFetchProps),

  addManager: (manager: IEnterpriseUserReqModel) => ({ method: "POST", url: "enterpriseUsers", body: manager } as IFetchProps),

  deleteManager: (managerId: string) => ({ method: "DELETE", url: `enterpriseUsers/${managerId}` } as IFetchProps),

  getUserRoles: (managerId: string) => ({ method: "GET", url: `enterpriseUsers/${managerId}/managementModules` } as IFetchProps),
  addUserRole: (userRole: IUserRoleReqModel) => ({ method: "POST", url: `managementModules`, body: userRole } as IFetchProps),
  deleteUserRole: (managerId: string, roleId: string) => ({ method: "DELETE", url: `enterpriseUsers/${managerId}/managementModules/${roleId}` } as IFetchProps),

  getEmployeeUsers: (managerId: string) => ({ method: "GET", url: `enterpriseUsers/${managerId}/employeeUsers` } as IFetchProps),
  activateEmployeeUser: (input: IEmployeeUserReqModel) => ({ method: "POST", url: "employeeUsers", body: input } as IFetchProps),
  reativateEmployeeUser: (id: string, input: IEmployeeUserReqModel) => ({ method: "PUT", url: `employeeUsers/${id}`, body: input } as IFetchProps),
}
  
export const ManagerService = {
  getManagers: async () => $fetch<IEnterpriseUserRspModel[]>(Api.getManagers()),

  getWeChatDepartments: () => $fetch<IWeChatDepartmentRspModel[]>(Api.getWeChatDepartments()),

  getWeChatUsers: async (departmentId: number) => $fetch<IWeChatUserModel[]>(Api.getWeChatUsers(departmentId)),
  getRoles: async () => $fetch<IRoleRspModel[]>(Api.getRoles()),

  addManager: async (manager: IEnterpriseUserReqModel) => $fetch(Api.addManager(manager)),
  deleteManager: async (managerId: string) => $fetch(Api.deleteManager(managerId)),

  getUserRoles: async (managerId: string) => $fetch<IRoleRspModel[]>(Api.getUserRoles(managerId)),
  addUserRole: async (userRole: IUserRoleReqModel) => $fetch(Api.addUserRole(userRole)),
  deleteUserRole: async (managerId: string, roleId: string) => $fetch(Api.deleteUserRole(managerId, roleId)),

  getEmployeeUsers: async (managerId: string) => $fetch<IEmployeeUserRspModel[]>(Api.getEmployeeUsers(managerId)),
  activateEmployeeUser: async(input: IEmployeeUserReqModel) => $fetch(Api.activateEmployeeUser(input)),
  reativateEmployeeUser: async(id: string, input: IEmployeeUserReqModel) => $fetch(Api.reativateEmployeeUser(id, input)),
}