import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faCirclePlay, faSquarePlus } from '@fortawesome/free-regular-svg-icons';

import './editorMode.css';
import type { EditModeSettings } from '../../../configs/editModeSettings.ts';
import fileTypes from '../../../configs/fileTypes.ts';
import type InteractiveModeModel from '../../../models/interactiveModeModel.ts';

// ---------- Toolbar ----------
const Toolbar = ({
  onSave,
  onAdd,
  onRun,
  onSettings,
  selectedType,
  setSelectedType
}: {
  onSave: () => void;
  onAdd: () => void;
  onRun: () => void;
  onSettings: () => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
}) => (
  <div className='editModeSubContainer'>
    <p className="containerTitle">Tool Bar</p>
    <div className='toolbarElements'>
      <button className='toolbarBtn' onClick={onSave} type="button">
        <FontAwesomeIcon size="2x" icon={faFloppyDisk} />
        <p>Save</p>
      </button>

      <button className='toolbarBtn' onClick={onAdd} type="button">
        <FontAwesomeIcon size="2x" icon={faSquarePlus} />
        <p>Add</p>
      </button>

      <select
        className='addType'
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="text editor">Text Editor</option>
        <option value="audio editor">Audio Editor</option>
        <option value="file">File</option>
        <option value="user input">User Input</option>
      </select>

      <button className='toolbarBtn' onClick={onRun} type="button">
        <FontAwesomeIcon size="2x" icon={faCirclePlay} />
        <p>Run</p>
      </button>

      <button className='toolbarBtn' onClick={onSettings} type="button">
        <FontAwesomeIcon size="2x" icon={faCirclePlay} />
        <p>Settings</p>
      </button>
    </div>
  </div>
);

// ---------- Course Details ----------
const CourseDetails = ({ info }: { info: EditModeSettings }) => (
  <div className='editModeSubContainer'>
    <p className="containerTitle">COURSE DETAILS</p>
    <div>
      {info.courseDetails.courseName && <p><b>Course Name:</b> {info.courseDetails.courseName}</p>}
      {info.courseDetails.courseDescription && <p><b>Description:</b> {info.courseDetails.courseDescription}</p>}
      {info.courseDetails.prerequisites && <p><b>Prerequisites:</b> {info.courseDetails.prerequisites}</p>}
    </div>
  </div>
);

// ---------- Files ----------
const FilesSection = ({ files }: { files: string[] }) => (
  <div className='editModeSubContainer'>
    <p className="containerTitle">FILES</p>
    <div className='fileElements'>
      {files.map((file, idx) => (
        <button key={idx}>{file}</button>
      ))}
    </div>
    <button>OVERVIEW</button>
  </div>
);

// ---------- Main Editor ----------
const MainEditor = ({
  main,
  onTextChange,
  onRunChange,
  onRemove
}: {
  main: InteractiveModeModel[];
  onTextChange: (mainIdx: number, textIdx: number, field: 'time' | 'context', val: string) => void;
  onRunChange: (mainIdx: number, textIdx: number, run: boolean) => void;
  onRemove: (mainIdx: number, textIdx: number) => void;
}) => (
  <div className='editModeSubContainerMain editModeSubContainer'>
    <p className="containerTitle">MAIN</p>
    <div className='ContainerMain'>
      {main.map((field, mainIdx) =>
        field.text.map((t, textIdx) => (
          <div className="mainContainer" key={`${mainIdx}-${textIdx}`}>
            <div className="mainSubContainer">
              <p style={{ backgroundColor: 'red', color: 'white' }}>{mainIdx + 1}</p>
              <label>TIME</label>
              <input
                type="text"
                value={t.time}
                onChange={(e) => onTextChange(mainIdx, textIdx, 'time', e.target.value)}
              />
              <label>RUN</label>
              <button
                onClick={() => onRunChange(mainIdx, textIdx, false)}
                style={{ backgroundColor: !t.run ? "red" : "gray" }}
              >OFF</button>
              <button
                onClick={() => onRunChange(mainIdx, textIdx, true)}
                style={{ backgroundColor: t.run ? "green" : "gray" }}
              >ON</button>
              <p>FIELD NAME: {field.fileName}</p>
              <p>FIELD TYPE: {field.fileType}</p>
            </div>

            <div className="mainSubContainer">
              <label>Context</label>
              <textarea
                value={t.context}
                onChange={(e) => onTextChange(mainIdx, textIdx, 'context', e.target.value)}
              />
            </div>

            <div className="mainSubContainer">
              <label>Remove</label>
              <input type="button" value="remove field" onClick={() => onRemove(mainIdx, textIdx)} />
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

// Output Display
const OutputDisplay = ({outputDisplayVar}:{outputDisplayVar:string} )=>(
  <div>
    { outputDisplayVar }
  </div>
  // <pre>
  //   <code>
  //   </code>
  // </pre>
)

// ---------- Audio Editor ----------
const AudioEditor = ({ audio, onRemove }: { audio: { time: string; audioLink: string; audioStartTime: string; audioEndTime: string }[];
  onRemove: (idx: number) => void;
}) => (
  <div>
    <p className="containerTitle">AUDIO EDITOR</p>
    <div className='editModeSubContainerAudio'>
      { audio.map((field, idx) => (
        <div className="mainContainer" key={idx}>
          <div className="mainSubContainer">
            <p style={{ backgroundColor: 'red', color: 'white' }}>{idx + 1}</p>
            <label>TIME</label>
            <input type="text" value={field.time} readOnly />
            <label>Start</label>
            <input type="text" value={field.audioStartTime} readOnly />
            <label>End</label>
            <input type="text" value={field.audioEndTime} readOnly />
          </div>
          <div className="mainSubContainer">
            <label>AUDIO</label>
            <input type="file" accept="audio/*" />
            <audio controls src={field.audioLink}></audio>
          </div>
          <div className="mainSubContainer">
            <label>Remove</label>
            <input type="button" value="remove field" onClick={() => onRemove(idx)} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ---------- Main Component ----------
function EditMode() {
  const { courseName = "", courseCollection = "" } = useParams();
  const [selectedAddType, setSelectedAddType] = useState("text editor");
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTime, setTrackTime] = useState(0);
  const [minute, setMinute] = useState(0);
  const [outputDisplayVar, updateOutputDisplayVar ] = useState("");

  const [courseInformation, updateCourseInformation] = useState<EditModeSettings>({
    courseDetails: {
      courseName: courseName.split("-").join(" "),
      courseDescription: "",
      prerequisites: "",
      price: 0,
      accessPeriod: 0,
      courseCollection
    },
    files: [],
    courseSettings: [],
    main: [
      {
        text: [{ time: "00:00", context: "<p>test text</p>", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        text: [{ time: "00:03", context: "<p>test text</p><button>press me</button>", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.Cascading_Style_Sheet_Document,
        fileName: "index"
      },
      {
        text: [{ time: "00:05", context: "<h1>lets get started</h1>", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.Cascading_Style_Sheet_Document,
        fileName: "index"
      }
    ],
    audio: [
      { time: "00:00", audioLink: "", audioStartTime: "02:00", audioEndTime: "07:00" }
    ]
  });

  // -------- Handlers ----------
  const handleRemoveText = (mainIdx: number, textIdx: number) => {
    updateCourseInformation(prev => ({
      ...prev,
      main: prev.main.map((item, i) =>
        i === mainIdx ? { ...item, text: item.text.filter((_, j) => j !== textIdx) } : item
      )
    }));
  };

  const handleRemoveAudio = (idx: number) => {
    updateCourseInformation(prev => ({
      ...prev,
      audio: prev.audio.filter((_, j) => j !== idx)
    }));
  };

  const handleAdd = () => {
    if (selectedAddType === "text editor") {
      updateCourseInformation(prev => ({
        ...prev,
        main: [
          ...prev.main,
          {
            text: [{ time: "", context: "", run: false }],
            curse: { time: "", x: 0, y: 0 },
            fileType: fileTypes.HTML,
            fileName: ""
          }
        ]
      }));
    } else if (selectedAddType === "audio editor") {
      updateCourseInformation(prev => ({
        ...prev,
        audio: [...prev.audio, { time: "", audioLink: "", audioStartTime: "", audioEndTime: "" }]
      }));
    } else {
      console.log(`${selectedAddType} added`);
    }
  };

  const handleTextChange = (
    mainIdx: number,
    textIdx: number,
    field: "time" | "context",
    newValue: string
  ) => {
    updateCourseInformation(prev => ({
      ...prev,
      main: prev.main.map((item, i) =>
        i === mainIdx
          ? {
              ...item,
              text: item.text.map((t, j) => (j === textIdx ? { ...t, [field]: newValue } : t))
            }
          : item
      )
    }));
  };

  const handleRunChange = (mainIdx: number, textIdx: number, run: boolean) => {
    updateCourseInformation(prev => ({
      ...prev,
      main: prev.main.map((item, i) =>
        i === mainIdx
          ? {
              ...item,
              text: item.text.map((t, j) => (j === textIdx ? { ...t, run } : t))
            }
          : item
      )
    }));
  };

  const togglePlayPause = () => setIsPlaying(prev => !prev);

  // -------- Effects ----------
  useEffect(() => {
    updateCourseInformation(prev => ({
      ...prev,
      files: [...prev.files, ...prev.main.map(p => `${p.fileName}.${p.fileType}`)]
    }));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => setTrackTime(t => t + 1), 1000);
    //increase the minutes and reset seconds
    if (trackTime%60) ()=>{ setTrackTime(0); setMinute(m => m+1);}
    const currentTime = (trackTime<10) ? `00:0${trackTime}` : (minute < 10) ? (`0${minute}:${trackTime}`) : (`${minute} : ${trackTime}`);
    console.log(currentTime);
    courseInformation.main.map(m  =>{
      m.text.map(t =>{
        if(t.time == currentTime && t.run == true){
          updateOutputDisplayVar(t.context);
          console.log(t.context);
        }
      })
    })
    return () => clearTimeout(timer);
  }, [isPlaying, trackTime]);

  // -------- Render ----------
  return (
    <div className='editModeMainContainer'>
      <Toolbar
        onSave={() => console.log("save")}
        onAdd={handleAdd}
        onRun={() => console.log("run")}
        onSettings={() => console.log("settings")}
        selectedType={selectedAddType}
        setSelectedType={setSelectedAddType}
      />

      <div className='editModeSecondaryContainer'>
        <div id="one">
          <CourseDetails info={courseInformation} />
          <FilesSection files={courseInformation.files} />
          <div>
            <p className="containerTitle">COURSE SETTINGS</p>
          </div>
        </div>

        <div id="two">
          <MainEditor
            main={courseInformation.main}
            onTextChange={handleTextChange}
            onRunChange={handleRunChange}
            onRemove={handleRemoveText}
          />
          <AudioEditor audio={courseInformation.audio} onRemove={handleRemoveAudio} />
        </div>

        <div id="three">
          <p className="containerTitle">Output</p>
          <OutputDisplay outputDisplayVar={outputDisplayVar}/>
        </div>
      </div>

      <div>
        <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
        <p>current time: {trackTime}s</p>
      </div>
    </div>
  );
}

export default EditMode;