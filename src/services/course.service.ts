import httpClient from "./httpClient"

const CourseService = {
    createCourse: (courseInfo:any)=>{
        return httpClient.post(`/courses/create`, courseInfo)
    },
    getCourseById: (courseId:string)=>{
        return httpClient.get(`/courses/${courseId}`)
    },
    getAllCourses: ()=>{
        return httpClient.get(`/courses`)
    }
}
export default CourseService;