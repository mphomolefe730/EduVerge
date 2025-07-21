import type { Option } from "./option";

export interface CourseDetails{
    courseName: string,
    courseDescription: string,
    prerequisites: string,
    price: number,
    accessPeriod: number,
    courseCollection: string
}