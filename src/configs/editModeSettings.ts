import type { CourseDetails } from "./courseDetails";

export interface EditModeSettings{
    toolBar:string[] | [],
    courseDetails: CourseDetails,
    files:string[]  | [],
    courseSettings:string[] | [],
    main: { time:string, context:string, run:boolean }[] | [],
    audio: { time:string, audioLink:string }[] |[],
}