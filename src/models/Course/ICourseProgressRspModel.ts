export interface ICourseProgressRspModel {
  id: string,
  name: string,
  phoneNumber : string,
  email: string,
  company: string,
  city: string,
  technicalOffice: string,
  courseCategory: string,
  progress: number,
  registerDate: Date,
  examDate?: Date,
  examScore: string
}