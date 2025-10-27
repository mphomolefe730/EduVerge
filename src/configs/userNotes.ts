import type fileTypes from "./fileTypes"

export interface UserNotes{
    id:string,
    userId: string,
    courseId: string,
    lessonId: string,
    notes: {
        noteId:string,
        time:string, 
        context:string,
        date: Date,
        fileType:fileTypes,
        fileName:string
    }[] | []
}