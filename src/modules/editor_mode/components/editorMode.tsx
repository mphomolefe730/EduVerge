import { type EditModeSettings } from '../../../configs/editModeSettings.ts';
import { useParams } from "react-router-dom";
import './editorMode.css';
import { faFloppyDisk, faCirclePlay, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fileTypes from '../../../configs/fileTypes.ts';
import type InteractiveModeModel from '../../../models/interactiveModeModel.ts';
import { useState } from 'react';

function EditMode(){
    const params = useParams();
    const [selectedAddType, setSelectedAddType] = useState('text editor');
    const courseName = (params.courseName) ? params.courseName : '';
    const courseCollect = (params.courseCollection) ? params.courseCollection : '';

    let [testMainData, updateTestMainData ] = useState<InteractiveModeModel[]>([
        {
            text: [
                { time: '00:00', context: 'mxn', run: false }
            ],
            curse: {
                time: '',
                x: 0,
                y: 0
            },
            filetype: fileTypes.HTML
            },{
            text: [
                { time: '00:03', context: '.xnxbx{', run: true }
            ],
            curse: {
                time: '',
                x: 0,
                y: 0
            },
            filetype: fileTypes.Cascading_Style_Sheet_Document
        }
    ]);

    let courseInformation:EditModeSettings = {
        courseDetails: {
            courseName: courseName.split("-").join(" "),
            courseDescription: '',
            prerequisites: '',
            price: 0,
            accessPeriod: 0,
            courseCollection: courseCollect
        },
        files: ["index.js"],
        courseSettings: [],
        main: testMainData,
        audio: [],
    };

    let handleFunction = () =>{
        console.log('clicked');
    }

    const handleRemoveText = (mainIdx: number, textIdx: number) => {
        updateTestMainData(prevData =>
            prevData.map((item, i) => {
                if (i !== mainIdx) return item;
                return {
                    ...item,
                    text: item.text.filter((_, j) => j !== textIdx)
                };
            })
        );
    };

    const handleAdd = (fieldType:string) => {
        if(fieldType == 'text editor'){
            updateTestMainData([...testMainData, 
                {
                    text: [
                        { time: '', context: '', run: false }
                    ],
                    curse: {
                        time: '',
                        x: 0,
                        y: 0
                    },
                    filetype: fileTypes.HTML
                }
            ]);
        }else if(fieldtype == 'file'){};
    };

    const handleTextChange = (
        mainIdx: number,
        textIdx: number,
        field: 'time' | 'context',
        newValue: string
    ) => {
        updateTestMainData(prevData =>
            prevData.map((item, i) => {
                if (i !== mainIdx) return item;
                console.log(courseInformation.main);
                return {
                    ...item,
                    text: item.text.map((textObj, j) =>
                        j === textIdx ? { ...textObj, [field]: newValue } : textObj
                    )
                };
            })
        );
    };

    const handleRunChange = (mainIdx: number, textIdx: number, runValue: boolean) => {
        updateTestMainData(prevData =>
            prevData.map((item, i) => {
                if (i !== mainIdx) return item;
                return {
                    ...item,
                    text: item.text.map((textObj, j) =>
                        j === textIdx ? { ...textObj, run: runValue } : textObj
                    )
                };
            })
        );
    };
    
    return(
        <div className='editModeMainContainer'>
            <div className='editModeSubContainer'>
                <p className="containerTitle">Tool Bar</p>
                <div className='toolbarElements'>
                    <button className='toolbarBtn' onClick={handleFunction} type="button"><FontAwesomeIcon size="2x" icon={faFloppyDisk}/><p>Save</p></button>
                    <button onClick={ () => handleAdd(selectedAddType) } type="button" className='toolbarBtn' ><FontAwesomeIcon size="2x" icon={faSquarePlus } /><p>Add</p></button>
                    <select style={{ margin: '0'}} className='addType' value={selectedAddType} onChange={(e) => setSelectedAddType(e.target.value) }>
                        <option selected value="text editor">Text Editor</option>
                        <option value="audio editor">Audio Editor</option>
                        <option value="file">File</option>
                        <option value="user input">User Input</option>
                    </select>
                    <button onClick={handleFunction} value='run' type="button" className='toolbarBtn' ><FontAwesomeIcon size="2x" icon={ faCirclePlay } /><p>Run</p></button>
                    <button onClick={handleFunction} value='settings' type="button" className='toolbarBtn' ><FontAwesomeIcon size="2x" icon={ faCirclePlay } /><p>Setting</p></button>
                </div>
            </div>
            <div className='editModeSecondaryContainer'>
                <div id="one">
                    <div className='editModeSubContainer'>
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
                    <div className='editModeSubContainer'>
                        <p className="containerTitle">FILES</p>
                        <div className='fileElements'>
                            {
                                courseInformation.files.map((fileName, fileIndex)=>{
                                    return(
                                        <button> { fileName } </button>
                                    )
                                })
                            }
                        </div>
                        <button> OVERVIEW </button>
                    </div>
                    <div>
                        <p className="containerTitle">COURSE SETTINGS</p>
                        <div></div>
                    </div>
                </div>
                <div id="two">
                    <div className='editModeSubContainer'>
                        <p className="containerTitle">MAIN</p>
                        <div>
                            <div>                                
                                { 
                                    courseInformation.main.map((field, index) => {
                                        return(
                                            field.text.map((t, textIndex)=>{
                                                return(
                                                    <div className="mainContainer">
                                                        <div className="mainSubContainer">
                                                            <label htmlFor="courseTime"> TIME </label>
                                                            <input type="text" placeholder={t.time} value={t.time} onChange={(e) => { handleTextChange(index, index,  'time', e.target.value)}}/>
                                                            <label htmlFor="courseRun"> RUN  </label>
                                                            <button onClick={() => { handleRunChange(index, textIndex,false) }} style={{ backgroundColor:(t.run == false )? "red":"gray"}}>OFF</button>
                                                            <button onClick={() => { handleRunChange(index, textIndex, true) }} style={{ backgroundColor:(t.run) ? "green":"gray"}}>ON</button>
                                                            <p>FIELD TYPE: { field.filetype }</p>
                                                        </div>
                                                        <div className="mainSubContainer">
                                                            <label htmlFor="courseContext"> Context </label>
                                                            <p>
                                                            </p>
                                                            <textarea placeholder={t.context} value={t.context} onChange={(e) => { handleTextChange(index, index,  'context', e.target.value)}}/>
                                                        </div>
                                                        <div className="mainSubContainer">
                                                            <label htmlFor="courseremove"> Remove </label>
                                                            <input type="button" value="remove field" onClick={() => handleRemoveText(index, textIndex)} />
                                                        </div>
                                                    </div>
                                                )
                                            }) 
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='editModeSubContainer'>
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