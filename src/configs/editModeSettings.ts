import type InteractiveModeModel from "../models/interactiveModeModel";
import type { CourseDetails } from "./courseDetails";

export interface EditModeSettings{
    id:string,
    courseDetails: CourseDetails,
    files:string[],
    courseSettings:string[],
    main: InteractiveModeModel[],
    audio: { id:string, time:string, audioLink:string, audioStartTime:string, audioEndTime:string }[] | [],
}