// id, groupName, description, courseId, createdBy, createdAt, tags, difficulty, maxMembers, isPublic
export default interface StudyGroup{
    id:string,
    groupName:string,
    description:string,
    courseId:string,
    createdBy:string,
    createdAt:Date,
    difficulty:string,
    maxMembers:number,
    isPublic:boolean
}