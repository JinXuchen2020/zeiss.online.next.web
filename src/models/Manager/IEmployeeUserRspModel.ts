export interface IEmployeeUserRspModel {
  id?: string,
  userId: string,
  name: string,
  phoneNumber: number,
  weChatImagePath: string,
  email: string,
  businessType?: string,
  company: string,
  expirationDate?: Date
}