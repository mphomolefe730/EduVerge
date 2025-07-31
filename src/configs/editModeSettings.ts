import type InteractiveModeModel from "../models/interactiveModeModel";
import type { CourseDetails } from "./courseDetails";

export interface EditModeSettings{
    courseDetails: CourseDetails,
    files:string[]  | [],
    courseSettings:string[] | [],
    main: InteractiveModeModel[] | [],
    audio: { time:string, audioLink:string }[] |[],
}