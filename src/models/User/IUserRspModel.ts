import { IIndustryRspModel } from './IIndustryRspModel'
import { IProvinceRspModel } from './IProvinceRspModel'
import { ICityRspModel } from './ICityRspModel'
import { IBusinessTypeRspModel } from './IBusinessTypeRspModel'

export interface IUserRspModel {
  id: string,
  name: string,
  phoneNumber: number,
  email: string,
  company: string,
  jobTitle: string,
  college: string,
  status: boolean,
  industry?: IIndustryRspModel,
  industryText: string,
  province?: IProvinceRspModel,
  city?: ICityRspModel,
  businessType?: IBusinessTypeRspModel,
  seriesNumbers: string,
  technicalOffice: string,
  department: string,
  isMemberGroupLeader: boolean,
  registerDate: Date,
  createdDate?: Date,
  createdBy?: IUserRspModel,
}