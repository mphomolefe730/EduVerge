import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause } from "@fortawesome/free-regular-svg-icons";
import { EditorView, basicSetup } from "codemirror";
import type { EditModeSettings } from "../../../configs/editModeSettings.ts";
import fileTypes from "../../../configs/fileTypes.ts";
import type InteractiveModeModel from "../../../models/interactiveModeModel.ts";
import './interactiveMode.css';
import CodeMirror from '@uiw/react-codemirror';
import { bespin } from '@uiw/codemirror-theme-bespin';
import { html } from '@codemirror/lang-html';
import type { UserNotes, Note } from "../../../configs/userNotes.ts";

const htmlCompletion = html({
  autoCloseTags: true,
  matchClosingTags: true
});

// ---------- Course Details ----------
const CourseDetails = ({ info }: { info: EditModeSettings }) => (
  <div className="editModeSubContainer">
    <p className="containerTitle">COURSE DETAILS</p>
    <div>
      {info.courseDetails.courseName && (
        <p>
          <b>Course Name:</b> {info.courseDetails.courseName}
        </p>
      )}
      {info.courseDetails.courseDescription && (
        <p>
          <b>Description:</b> {info.courseDetails.courseDescription}
        </p>
      )}
      {info.courseDetails.prerequisites && (
        <p>
          <b>Prerequisites:</b> {info.courseDetails.prerequisites}
        </p>
      )}
    </div>
  </div>
);

// ---------- Files ----------
const FilesSection = ({ files }: { files: string[] }) => (
  <div className="editModeSubContainer">
    <p className="containerTitle">FILES</p>
    <div className="fileElements">
      {files.map((file, idx) => (
        <button key={idx} onClick={() => console.log("file clicked")}>
          {file}
        </button>
      ))}
    </div>
    <button>REMOVE FILTER</button>
  </div>
);

// ---------- Notes ----------
const NotesSection = ({ 
  userNotes, 
  onNoteClick 
}: { 
  userNotes: UserNotes;
  onNoteClick: (note: Note) => void;
}) => (
  <div>
    <p className="containerTitle">NOTES</p>
    { 
      userNotes.notes.map((n, index) => {
        return (
          <div 
            key={n.noteId} 
            className="note-item" 
            onClick={() => onNoteClick(n)}
            style={{ 
              cursor: 'pointer', 
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              backgroundColor: '#f5f5f5'
            }}
          >
            <h3 style={{ 
              whiteSpace: "nowrap", 
              maxWidth: "7rem", 
              overflow: "hidden", 
              textOverflow: "ellipsis"
            }}>
              {n.noteId}
            </h3>
            <p>{n.time}</p>
            <div 
              style={{
                maxHeight: '3rem',
                overflow: 'hidden',
                fontSize: '0.8rem',
                color: '#666'
              }}
              dangerouslySetInnerHTML={{ __html: n.context }}
            />
          </div>
        )
      })
    }
  </div>
);

// ---------- Output Display ----------
const OutputDisplay = ({ outputDisplayVar }: { outputDisplayVar: string }) => (
  <div dangerouslySetInnerHTML={{ __html: outputDisplayVar }}></div>
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
        <div className="timelineProgress" style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="timelineTime">
        <span>
          {Math.floor(current / 60)}:{String(Math.floor(current % 60)).padStart(2, "0")}
        </span>
        <span>
          {Math.floor(total / 60)}:{String(Math.floor(total % 60)).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
function InteractiveMode() {
  // ------------ Application State Management ------------
  const [appState, setAppState] = useState<'normal' | 'editNote' | 'running'>('normal');
  const [originalEditorText, setOriginalEditorText] = useState(""); 
  const [isEditorTouched, setIsEditorTouched] = useState(false); 
  const [tempNoteId, setTempNoteId] = useState<string | null>(null); 
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  
  const { courseName = "", courseCollection = "" } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTime, setTrackTime] = useState(0);
  const [editorText, setEditorText] = useState("");
  const [outputDisplayVar, updateOutputDisplayVar] = useState("");
  
  const [userNotes, updateUserNotes] = useState<UserNotes>({
    id: "7920e181-8252-4ad7-9d8e-66c5f3cb1f76",
    userId: "",
    courseId: "",
    lessonId: "",
    notes: []
  });

  // ---------- Toolbar ----------
  const Toolbar = ({ onRun }: { onRun: () => void }) => (
    <div className="editModeSubContainer">
      <p className="containerTitle">
        {appState === 'editNote' ? "EDITING NOTE" : 
         appState === 'running' ? "CODE EXECUTED - EDIT MODE" : "Tool Bar"}
        
        {(appState === 'editNote' || appState === 'running') && (
          <button 
            onClick={returnToNormalMode}
            style={{ 
              marginLeft: '1rem', 
              padding: '0.25rem 0.5rem',
              fontSize: '0.8rem',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Return to Course
          </button>
        )}
      </p>
      <div className="toolbarElements">
        <button className="toolbarBtn" onClick={onRun} type="button">
          <FontAwesomeIcon size="2x" icon={faCirclePlay} />
          <p>Run</p>
        </button>
      </div>
    </div>
  );

  const [courseInformation, updateCourseInformation] = useState<EditModeSettings>({
    id: "",
    courseDetails: {
      id: "",
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
      }
    ],
    audio: [
      { id: "", time: "00:00", audioLink: "/src/assets/audio/welcome.ogg", audioStartTime: "00:00", audioEndTime: "00:07" },
      { id: "", time: "00:07", audioLink: "/src/assets/audio/courseOverview_pt1.ogg", audioStartTime: "00:01", audioEndTime: "00:07" }
    ]
  });

  // Handle CodeMirror changes
  const handleEditorChange = (value: string) => {
    // If we're currently editing a specific note (not the main course content)
    if (currentNoteId || appState === 'editNote') {
      updateUserNotes(prev => ({
        ...prev,
        notes: prev.notes.map(note => 
          note.noteId === (currentNoteId || tempNoteId)
            ? { ...note, context: value }
            : note
        )
      }));
    } 
    // If we're editing the main course content and this is the first change
    else if (!isEditorTouched && appState === 'normal') {
      console.log("editor touched - creating new note");
      setIsEditorTouched(true);
      setOriginalEditorText(editorText);
      
      const newNoteId = `temp-${Date.now()}`;
      setTempNoteId(newNoteId);      
      const newNote = {
        noteId: newNoteId,
        time: `00:${String(trackTime).padStart(2, "0")}`,
        context: value,
        date: new Date(),
        fileType: fileTypes.HTML,
        fileName: "index"
      };
      
      updateUserNotes(prev => ({
        ...prev,
        notes: [...prev.notes, newNote]
      }));
    } 
    // If we're editing the main course content and have a temp note
    else if (tempNoteId && appState === 'normal') {
      updateUserNotes(prev => ({
        ...prev,
        notes: prev.notes.map(note => 
          note.noteId === tempNoteId 
            ? { ...note, context: value, time: `00:${String(trackTime).padStart(2, "0")}` }
            : note
        )
      }));
    }
    
    setEditorText(value);
  };

  // Save note only if changes were made
  const saveNoteIfChanged = () => {
    if (isEditorTouched && tempNoteId) {
      const currentNote = userNotes.notes.find(note => note.noteId === tempNoteId);
      
      if (currentNote && currentNote.context !== originalEditorText) {
        // Changes were made, convert temp note to permanent
        updateUserNotes(prev => ({
          ...prev,
          notes: prev.notes.map(note => 
            note.noteId === tempNoteId 
              ? { ...note, noteId: `note-${Date.now()}` }
              : note
          )
        }));
        console.log("Note saved with changes");
      } else {
        // No changes made, remove the temporary note
        updateUserNotes(prev => ({
          ...prev,
          notes: prev.notes.filter(note => note.noteId !== tempNoteId)
        }));
        console.log("Note discarded - no changes made");
      }
      
      // Reset touch state
      setIsEditorTouched(false);
      setTempNoteId(null);
    }
  };

  // Handle Run button - Execute code and enter edit note mode
  const handleRun = () => {
    console.log("Executing code and entering edit mode");    
    // Save any pending changes first
    saveNoteIfChanged();    
    // Execute the code - display editor content in output
    updateOutputDisplayVar(editorText);    
    // Create a temporary note for the executed code
    const runNoteId = `run-${Date.now()}`;
    setTempNoteId(runNoteId);
    const runNote = {
      noteId: runNoteId,
      time: `00:${String(trackTime).padStart(2, "0")}`,
      context: editorText,
      date: new Date(),
      fileType: fileTypes.HTML,
      fileName: "executed-code"
    };
    
    updateUserNotes(prev => ({
      ...prev,
      notes: [...prev.notes, runNote]
    }));
    
    // Enter edit note mode
    setAppState('running');
    setCurrentNoteId(runNoteId);
    setIsEditorTouched(true);
    setOriginalEditorText(editorText);    
    console.log("Code executed. Application is now in edit mode.");
  };

  // Return to normal course mode
  const returnToNormalMode = () => {
    console.log("Returning to normal course mode");
    
    // Save any changes made during edit mode
    if (currentNoteId || tempNoteId) {
      const noteId = currentNoteId || tempNoteId;
      const currentNote = userNotes.notes.find(note => note.noteId === noteId);
      
      if (currentNote) {
        updateUserNotes(prev => ({
          ...prev,
          notes: prev.notes.map(note => 
            note.noteId === noteId 
              ? { ...note, context: editorText }
              : note
          )
        }));
        console.log("Changes saved before returning to normal mode");
      }
    }
    
    // Reset to normal state
    setAppState('normal');
    setCurrentNoteId(null);
    
    // Load the current course content based on trackTime
    const currentTime = `00:${String(trackTime).padStart(2, "0")}`;
    let foundContent = false;
    
    courseInformation.main.forEach((m) => {
      m.text.forEach((t) => {
        if (t.time === currentTime) {
          setEditorText(t.context);
          foundContent = true;
        }
      });
    });
    
    if (!foundContent) {
      setEditorText("");
    }
    
    // Reset touch state
    setIsEditorTouched(false);
    setTempNoteId(null);
    
    console.log("Returned to normal course mode");
  };

  // Handle note click
  const handleNoteClick = (note: Note) => {
    console.log("Note clicked:", note.noteId);
    
    // Save any pending changes from current editing session
    saveNoteIfChanged();
    
    // Pause the course if playing
    if (isPlaying) {
      setIsPlaying(false);
      console.log("Course paused");
    }
    
    // Load the note content into the editor and enter edit mode
    setEditorText(note.context);
    setCurrentNoteId(note.noteId);
    setAppState('editNote');
    
    console.log("Note loaded into editor - edit mode activated");
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      // Pausing - save note if changes were made
      saveNoteIfChanged();
      setIsPlaying(false);
    } else {
      // Starting to play - always return to normal mode first
      if (appState !== 'normal') {
        returnToNormalMode();
      }
      setIsPlaying(true);
    }
  };

  // -------- Handlers ----------
  const getTimeInSeconds = (time: string) => {
    const [m, s] = time.split(":").map(Number);
    return m * 60 + s;
  };
  
  const lastTextTime = courseInformation.main.length
    ? getTimeInSeconds(courseInformation.main.at(-1)!.text.at(-1)!.time)
    : 0;
  const lastAudioTime = courseInformation.audio.length
    ? getTimeInSeconds(courseInformation.audio.at(-1)!.audioEndTime)
    : 0;
  const timelineEndTime = Math.max(lastTextTime, lastAudioTime);

  const playAudioSegment = (audioLink: string, start: string, end: string) => {
    const audio = new Audio(audioLink);
    const startSec = getTimeInSeconds(start);
    const endSec = getTimeInSeconds(end);

    audio.addEventListener("loadedmetadata", () => {
      audio.currentTime = startSec;
      audio.play();

      const checkEnd = setInterval(() => {
        if (audio.currentTime >= endSec || !isPlaying) {
          audio.pause();
          clearInterval(checkEnd);
        }
      }, 200);
    });
  };

  // -------- Effects ----------
  useEffect(() => {
    updateCourseInformation((prev) => {
      const combinedFiles = [...prev.files, ...prev.main.map((p) => `${p.fileName}.${p.fileType}`)];
      const uniqueFiles = Array.from(new Set(combinedFiles));
      return { ...prev, files: uniqueFiles };
    });
  }, []);

  useEffect(() => {
    if (!isPlaying || appState !== 'normal') return;

    const timer = setTimeout(() => setTrackTime((t) => t + 1), 1000);
    const currentTime = `00:${String(trackTime).padStart(2, "0")}`;

    if (trackTime >= timelineEndTime) {
      setIsPlaying(false);
    }

    courseInformation.main.forEach((m) => {
      m.text.forEach((t) => {
        if (t.time === currentTime && t.run) {
          updateOutputDisplayVar(t.context);
        } 
        if (t.time === currentTime) {
          setEditorText(t.context);
        }
      });
    });

    courseInformation.audio.forEach((a) => {
      if (a.time === currentTime) playAudioSegment(a.audioLink, a.audioStartTime, a.audioEndTime);
    });

    if (isEditorTouched && tempNoteId && trackTime % 5 === 0) {
      const currentNote = userNotes.notes.find(note => note.noteId === tempNoteId);
      if (currentNote && currentNote.context !== originalEditorText) {
        console.log("Auto-saving note due to time progression");
        saveNoteIfChanged();
        setIsEditorTouched(true);
        const newTempNoteId = `temp-${Date.now()}`;
        setTempNoteId(newTempNoteId);
        setOriginalEditorText(editorText);
      }
    }
    console.log(userNotes.notes);
    
    return () => clearTimeout(timer);
  }, [isPlaying, trackTime, appState]);

  // -------- Render ----------
  return (
    <div className="editModeMainContainer">
      <Toolbar onRun={handleRun} />

      <div className="editModeSecondaryContainer">
        <div id="one">
          <CourseDetails info={courseInformation} />
          <FilesSection files={courseInformation.files} />
          <NotesSection userNotes={userNotes} onNoteClick={handleNoteClick}/>
        </div>

        <div id="two">
          <CodeMirror 
            onChange={handleEditorChange}
            theme={bespin} 
            height="100vh" 
            value={editorText}
            extensions={[htmlCompletion]}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              indentOnInput: true,
            }}
            id="code-editor"
          />
          {(appState === 'editNote' || appState === 'running') && (
            <div style={{
              padding: '0.5rem',
              backgroundColor: appState === 'running' ? '#fff3cd' : '#e3f2fd',
              border: `1px solid ${appState === 'running' ? '#ffc107' : '#2196f3'}`,
              borderRadius: '4px',
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              color: appState === 'running' ? '#856404' : '#1565c0'
            }}>
              {appState === 'running' 
                ? '🚀 Code Executed - You are now in edit mode. Play course or click "Return to Course" to resume.' 
                : '📝 Editing Note - Changes are saved automatically'}
            </div>
          )}
        </div>

        <div id="three">
          <p className="containerTitle">Output</p>
          <OutputDisplay outputDisplayVar={outputDisplayVar} />
        </div>
      </div>

      <div className="editModeThreeContainer">
        <button className="toolbarBtn" onClick={togglePlayPause} disabled={appState === 'running'}>
          {isPlaying ? (
            <>
              <FontAwesomeIcon size="2x" icon={faCirclePause} />
              <p>PAUSE</p>
            </>
          ) : (
            <>
              <FontAwesomeIcon size="2x" icon={faCirclePlay} />
              <p>PLAY</p>
            </>
          )}
        </button>
        <Timeline current={trackTime} total={timelineEndTime} onSeek={(newTime) => setTrackTime(Math.floor(newTime))} />
      </div>
    </div>
  );
}

export default InteractiveMode;