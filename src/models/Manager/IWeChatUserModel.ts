export interface IWeChatUserModel {
  userId: string,
  name: string,
  phoneNumber: string,
  departments: number[],
  email?: string,
  bizEmail: string,
  weChatImagePath: string,
  errorCode: string,
  errorMsg: string,
}