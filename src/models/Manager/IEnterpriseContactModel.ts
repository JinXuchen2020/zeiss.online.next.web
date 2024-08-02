export interface IEnterpriseContactModel {
  departmentList: {
    id: string;
    name: string;
  }[],
  userList: {
    id: string;
    name: string;
    avatar: string;
  }[]
}