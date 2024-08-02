import { ICourseRspModel } from ".";

export interface ILearningPlan {
    key: string,
    name: string,
    description: string,
    startDate: Date,
    isPublished: boolean,
    courses: ICourseRspModel[]
};