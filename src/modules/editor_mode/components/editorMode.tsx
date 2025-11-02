import { useParams } from "react-router-dom";
import { useEffect, useState, type WebViewHTMLAttributes } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faCirclePlay, faSquarePlus, faCirclePause } from '@fortawesome/free-regular-svg-icons';

import './editorMode.css';
import type { EditModeSettings } from '../../../configs/editModeSettings.ts';
import fileTypes from '../../../configs/fileTypes.ts';
import type InteractiveModeModel from '../../../models/interactiveModeModel.ts';
import CourseService from "../../../services/course.service.ts";

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
  <div className='editModeSubContainer bg-white rounded-xl shadow m-1'>
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
        <button key={idx} onClick={ ()=>console.log("file clicked") }>{file}</button>
      ))}
    </div>
    <button>REMOVE FILTER</button>
  </div>
);
// ---------- Course Settings ----------
const CourseSettings = ( {courseDetails} : {courseDetails: EditModeSettings["courseDetails"]} ) => (
  <div className="courseSettings">
    <p className="containerTitle">COURSE SETTINGS</p>
    <div>
      <label> Course Name </label>
      <input type="text" value={ courseDetails.courseName } readOnly />        
    </div>
    <div>
      <label> Course Description </label>
      <textarea value={ courseDetails.courseDescription }></textarea>        
    </div>
    <div>
      <label> Prerequisites </label>
      <input type="text" value={ courseDetails.prerequisites } readOnly />        
    </div>
    <div>
      <label> Price </label>
      <input type="number" value={ courseDetails.price } readOnly />        
    </div>
    <div>
      <label> Access Period </label>
      <input type="number" value={ courseDetails.accessPeriod } readOnly />        
    </div>
    <div>
      <label> Course Collection </label>
      <input type="type" value={ courseDetails.courseCollection } readOnly />        
    </div>
  </div>
)

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
              <label>TIMELINE TIME</label>
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
  <div dangerouslySetInnerHTML={{__html: outputDisplayVar}}>
  </div>
)

// ---------- Audio Editor ----------
const AudioEditor = ({
  audio,
  onRemove,
  onPlay
}: {
  audio: { time: string; audioLink: string; audioStartTime: string; audioEndTime: string }[];
  onRemove: (idx: number) => void;
  onPlay: (link: string, start: string, end: string) => void;
}) => (
  <div>
    <p className="containerTitle">AUDIO EDITOR</p>
    <div className='editModeSubContainerAudio'>
      {audio.map((field, idx) => (
        <div className="mainContainer" key={idx}>
          <div className="mainSubContainer">
            <p style={{ backgroundColor: 'red', color: 'white' }}>{idx + 1}</p>
            <label>TIMELINE TIME</label>
            <input type="text" value={field.time} readOnly />
            <label>START AUDIO AT</label>
            <input type="text" value={field.audioStartTime} readOnly />
            <label>END AUDIO AT</label>
            <input type="text" value={field.audioEndTime} readOnly />
          </div>

          <div className="mainSubContainer">
            <label>AUDIO</label>
            <input type="file" accept="audio/*" />
            <audio controls src={field.audioLink}></audio>
            <button onClick={() => onPlay(field.audioLink, field.audioStartTime, field.audioEndTime)}>
              ▶ Play Segment
            </button>
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
// ---------- Timeline ----------
const Timeline = ({
    current,
    total,
    onSeek
  }: {
    current: number;
    total: number;
    onSeek: (newTime: number) => void;
  }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * total;
      onSeek(newTime);
    };

    return (
      <div className="timelineContainer" onClick={handleClick}>
        <div className="timelineTrack">
          <div className="timelineProgress" style={{ width: `${percentage}%` }}> </div>
        </div>
        <div className="timelineTime">
          <span>{Math.floor(current / 60)}:{String(Math.floor(current % 60)).padStart(2, "0")}</span>
          <span>{Math.floor(total / 60)}:{String(Math.floor(total % 60)).padStart(2, "0")}</span>
        </div>
      </div>
    );
};

// ---------- Main Component ----------
function EditMode() {
  const { courseName = "", courseId = "", courseCollection = "" } = useParams();
  const [selectedAddType, setSelectedAddType] = useState("text editor");
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTime, setTrackTime] = useState(0);
  const [minute, setMinute] = useState(0);
  const [outputDisplayVar, updateOutputDisplayVar ] = useState("");
  const [informationFetched, setInformationFetched] = useState<boolean>(false);
  const [courseInformation, updateCourseInformation] = useState<EditModeSettings>({
    id: "",
    courseDetails: {
      id: "",
      courseName: "",
      courseDescription: "",
      prerequisites: "",
      price: 0,
      accessPeriod: 0,
      courseCollection: ""
    },
    files: [],
    courseSettings: [],
    main: [
      { 
        id: "", 
        text: [{ time: "00:00", context: "<p>welcome to</p><h1>EDU VERGE</h1>", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        id: "", 
        text: [{ time: "00:03", context: "<p>my name:</p><h1>Mpho Molefe</h1>", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        id: "", 
        text: [{ time: "00:08", context: "what will you learn:", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        id: "", 
        text: [{ time: "00:14", context: "what will you learn: <p>adding <button>button</button></p>", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        id: "", 
        text: [{ time: "00:16", context: "what will you learn: <p>adding <button>button</button></p><p>adding text</p>", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        id: "", 
        text: [{ time: "00:17", context: "what will you learn: <p>adding <button>button</button></p><p>adding text</p><p>allow use to add input</p>", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        id: "", 
        text: [{ time: "00:20", context: "clearing output.", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        id: "", 
        text: [{ time: "00:21", context: "clearing output..", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        id: "", 
        text: [{ time: "00:22", context: "clearing output...", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        id: "", 
        text: [{ time: "00:23", context: "", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      }
    ],
    audio: [
      { id: "",  time: "00:00", audioLink: "/src/assets/audio/welcome.ogg", audioStartTime: "00:00", audioEndTime: "00:07" },
      { id: "",  time: "00:07", audioLink: "/src/assets/audio/courseOverview_pt1.ogg", audioStartTime: "00:01", audioEndTime: "00:07" },
      { id: "",  time: "00:14", audioLink: "/src/assets/audio/courseOverview_pt2.ogg", audioStartTime: "00:00", audioEndTime: "00:04" },
      { id: "",  time: "00:18", audioLink: "/src/assets/audio/courseOverview_pt2.ogg", audioStartTime: "00:06", audioEndTime: "00:08" },
      { id: "",  time: "00:20", audioLink: "/src/assets/audio/courseOverview_pt2.ogg", audioStartTime: "00:11", audioEndTime: "00:13" },
    ]
  });

  // -------- Handlers ----------
  const getTimeInSeconds = (timeStr: string) => {
    const m = parseInt(timeStr.slice(0, 2), 10);
    const s = parseInt(timeStr.slice(3), 10);
    return m * 60 + s;
  };
  const lastTextTime = courseInformation.main.length ? getTimeInSeconds(courseInformation.main[courseInformation.main.length - 1].text.slice(-1)[0].time) : 0;
  const lastAudioTime = courseInformation.audio.length ? getTimeInSeconds(courseInformation.audio[courseInformation.audio.length - 1].audioEndTime) : 0;
  const timelineEndTime = Math.max(lastTextTime, lastAudioTime);
  
  const playAudioSegment = (audioLink: string, start: string, end: string) => {
    const audio = new Audio(audioLink);
    const timeToSeconds = (time: string) => {
      const [m, s] = time.split(":").map(Number);
      return m * 60 + s;
    };

    const startSec = timeToSeconds(start);
    const endSec = timeToSeconds(end);

    // Wait for metadata (so duration & seeking works)
    audio.addEventListener("loadedmetadata", () => {
      audio.currentTime = startSec;
      audio.play();

      const checkEnd = setInterval(() => {
        if (audio.currentTime >= endSec) {
          audio.pause();
          clearInterval(checkEnd);
        }
      }, 200);
    });

    // Handle errors gracefully
    audio.addEventListener("error", () => {
      console.error("Audio playback error for:", audioLink);
    });
  };

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
            id: "",
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
        audio: [...prev.audio, { id: "", time: "", audioLink: "", audioStartTime: "", audioEndTime: "" }]
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
    CourseService.getCourseById(courseId).then(response => {
      updateCourseInformation(response.data);
      setInformationFetched(true);
    }).catch(error => {
      console.error("Error fetching course data:", error);
    });
    updateCourseInformation(prev => {
      const combinedFiles = [...prev.files, ...prev.main.map(p => `${p.fileName}.${p.fileType}`)];
      const uniqueFiles = Array.from(new Set(combinedFiles));
      return {
        ...prev,
        files: uniqueFiles
      }
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setTimeout(() => setTrackTime(t => t + 1), 1000);
    //increase the minutes and reset seconds
    if (trackTime%60) ()=>{ setTrackTime(0); setMinute(m => m+1);}
    const currentTime = (trackTime<10) ? `00:0${trackTime}` : (minute < 10) ? (`0${minute}:${trackTime}`) : (`${minute} : ${trackTime}`);
    
    //used to auto stop the trackline ---- need to continue adding
    if (trackTime >= timelineEndTime) {
      togglePlayPause();
    }

    courseInformation.main.map(m  =>{
      m.text.map(t =>{
        if(t.time == currentTime && t.run == true){
          updateOutputDisplayVar(t.context);
        }
      })
    })
    courseInformation.audio.map(a =>{
      if (a.time == currentTime) playAudioSegment(a.audioLink, a.audioStartTime, a.audioEndTime);
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

      <div style={{ borderRadius: "1rem", display: (informationFetched) ? "none" : "flex", justifyContent: "center", alignContent: "center", backgroundColor: "white"}}> 
        <p>Loading content</p>
      </div>

      <div style={{ display: (informationFetched) ? "grid" : "none"}} className='editModeSecondaryContainer bg-white rounded-xl shadow m-1'>
        <div id="one">
          <CourseDetails info={courseInformation} />
          <FilesSection files={courseInformation.files} />
          <CourseSettings courseDetails={courseInformation.courseDetails}/>
        </div>

        <div id="two">
          <MainEditor
            main={courseInformation.main}
            onTextChange={handleTextChange}
            onRunChange={handleRunChange}
            onRemove={handleRemoveText}
          />
          <AudioEditor
            audio={courseInformation.audio}
            onRemove={handleRemoveAudio}
            onPlay={playAudioSegment}
          />
        </div>

        <div id="three">
          <p className="containerTitle">Output</p>
          <OutputDisplay outputDisplayVar={outputDisplayVar}/>
        </div>
      </div>

      <div className="editModeThreeContainer bg-white rounded-xl shadow m-1">
        <button className="toolbarBtn" onClick={togglePlayPause}>
          { isPlaying ? 
            <><FontAwesomeIcon size="2x" icon={faCirclePause} /><p>PAUSE</p></> : 
            <><FontAwesomeIcon size="2x" icon={faCirclePlay}/> <p>PLAY</p> </>
          }
        </button>
        <Timeline
          current={trackTime}
          total={timelineEndTime}
          onSeek={(newTime) => setTrackTime(Math.floor(newTime))}
        />
      </div>
    </div>
  );
}

export default EditMode;