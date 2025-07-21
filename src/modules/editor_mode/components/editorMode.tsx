import { type EditModeSettings } from '../../../configs/editModeSettings.ts';
import { useParams } from "react-router-dom";
import './editorMode.css'

function EditMode(){
     const params = useParams();
     const courseName = (params.courseName) ? params.courseName : '';
     const courseCollect = (params.courseCollection) ? params.courseCollection : '';

    let courseInformation:EditModeSettings = {
        toolBar: ['save','add','add type','settings'],
        courseDetails: {
            courseName: courseName.split("-").join(" "),
            courseDescription: '',
            prerequisites: '',
            price: 0,
            accessPeriod: 0,
            courseCollection: courseCollect
        },
        files: [],
        courseSettings: [],
        main: [],
        audio: []
    };
    
    return(
        <div className='editModeMainContainer'>
            <div>
                <p className="containerTitle">Tool Bar</p>
                <div></div>
            </div>
            <div className='editModeSecondaryContainer'>
                <div id="one">
                    <div>
                        <p className="containerTitle">COURSE DETAILS</p>
                        <div>
                            <div style={{ display: (courseInformation.courseDetails.courseName)? 'block' : 'none'}}>
                                <p><b>Course Name:</b> { courseInformation.courseDetails.courseName} </p>
                            </div>
                            <div style={{ display: (courseInformation.courseDetails.courseDescription)? 'block' : 'none'}}>
                                <p><b>Course Description:</b>  { courseInformation.courseDetails.courseDescription} </p>
                            </div>
                            <div style={{ display: (courseInformation.courseDetails.prerequisites)? 'block' : 'none'}}>
                                <p><b>Course prerequisites:</b> { courseInformation.courseDetails.prerequisites} </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="containerTitle">FILES</p>
                        <div></div>
                    </div>
                    <div>
                        <p className="containerTitle">COURSE SETTINGS</p>
                        <div></div>
                    </div>
                </div>
                <div id="two">
                    <div>
                        <p className="containerTitle">MAIN</p>
                        <div></div>
                    </div>
                    <div>
                        <p className="containerTitle">AUDIO EDITOR</p>
                        <div></div>
                    </div>
                </div>
                <div id="three">
                    <p className="containerTitle">Output</p>
                    <div></div>
                </div>
            </div>
            <div>
                <p>l</p>
            </div>
        </div>
    )
}

export default EditMode;