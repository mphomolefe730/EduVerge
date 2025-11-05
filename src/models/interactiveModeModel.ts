import fileType from '../configs/fileTypes.ts';

export default interface InteractiveModeModel{
	id:string,
	text: { id:string, time: string, context:string, run:boolean } [] | [];
	curse: { time:string, x: number, y: number};
	fileType: fileType;
	fileName: string
}

/* HELP ME TEXT --------------------------------------------------------------------------------------------
 * we will use the text element of the object to indicate all things to display.
 * text.time - will indicate when the text is supposed to show
 * text.context - will be all the text to show.
 * text.run - will indicate if the display should update the display when this part of the text is reached.
 * curse.time - will indicate the time at which the curse is supposed to be there
 * curse.x & curse.y - will indicate the curse position
*/