export interface IUserReqModel {
  name: string,
  phoneNumber: number,
  email: string,
  company: string,
  jobTitle: string,
  college: string,
  status: boolean,
  industryId?: string,
  profileImageId?: string,
  provinceId?: string,
  cityId?: string,
  districtId?: string,
}