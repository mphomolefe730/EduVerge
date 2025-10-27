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
import type { UserNotes } from "../../../configs/userNotes.ts";

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

// ---------- Main Editor ----------
const MainEditor = ({
  main,
  editorText,
  onChange
}: {
  main: InteractiveModeModel[];
  editorText: string;
  onChange: (newText: string) => void;
}) => {
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorContainerRef.current) return;

    // Create editor once
    if (!editorViewRef.current) {
      editorViewRef.current = new EditorView({
        parent: editorContainerRef.current,
        doc: editorText,
        extensions: [
          basicSetup,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
          })
        ]
      });
    }

    // Sync external text updates
    const view = editorViewRef.current;
    if (view && editorText !== view.state.doc.toString()) {
      const transaction = view.state.update({
        changes: { from: 0, to: view.state.doc.length, insert: editorText }
      });
      view.dispatch(transaction);
    }

    return () => {
      editorViewRef.current?.destroy();
      editorViewRef.current = null;
    };
  }, [editorText]);

  return (
    <div className="editModeSubContainerMain editModeSubContainer">
      <p className="containerTitle">MAIN</p>
      <div id="ContainerMain" ref={editorContainerRef}></div>
    </div>
  );
};

// ---------- Main Component ----------
function InteractiveMode() {
	// ------------ handle changes to notes
  const [originalEditorText, setOriginalEditorText] = useState(""); 
  const [isEditorTouched, setIsEditorTouched] = useState(false); 
  const [tempNoteId, setTempNoteId] = useState<string | null>(null); 
	const [currentNoteId, setCurrentNoteId] = useState<string | null>(null); // Track currently loaded note
  // ------------
  const { courseName = "", courseCollection = "" } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTime, setTrackTime] = useState(0);
  const [minute, setMinute] = useState(0);
  const [editorText, setEditorText] = useState("");
  const [outputDisplayVar, updateOutputDisplayVar] = useState("");
const [userNotes, updateUserNotes] = useState<UserNotes>({
	id: "7920e181-8252-4ad7-9d8e-66c5f3cb1f76",
	userId: "",
	courseId: "",
	lessonId: "",
	notes: [
  ]
})

// ---------- Toolbar ----------
  const Toolbar = ({ onRun }: { onRun: () => void }) => (
    <div className="editModeSubContainer">
      <p className="containerTitle">
        {currentNoteId ? "EDITING NOTE" : "Tool Bar"}
        {currentNoteId && (
          <button 
            onClick={returnToCourseContent}
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
    if (currentNoteId) {
      updateUserNotes(prev => ({
        ...prev,
        notes: prev.notes.map(note => 
          note.noteId === currentNoteId 
            ? { ...note, context: value }
            : note
        )
      }));
    } 
    // If we're editing the main course content and this is the first change
    else if (!isEditorTouched) {
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
    else if (tempNoteId) {
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
    
    // Load the note content into the editor
    setEditorText(note.context);
    setCurrentNoteId(note.noteId);
    
    console.log("Note loaded into editor");
  };

  // Handle returning to course content
  const returnToCourseContent = () => {
    // Save any changes made to the current note
    if (currentNoteId) {
      const currentNote = userNotes.notes.find(note => note.noteId === currentNoteId);
      if (currentNote) {
        updateUserNotes(prev => ({
          ...prev,
          notes: prev.notes.map(note => 
            note.noteId === currentNoteId 
              ? { ...note, context: editorText }
              : note
          )
        }));
        console.log("Note changes saved");
      }
    }
    
    // Reset to course content
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
      setEditorText(""); // Or keep current content
    }
    
    console.log("Returned to course content");
  };

  const handleRun = () => {
    // If we're editing a note, return to course content first
    if (currentNoteId) {
      returnToCourseContent();
    } else {
      // Save note if changes were made before running
      saveNoteIfChanged();
    }
    console.log("run");
    // Add your run logic here
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
  
  const togglePlayPause = () => {
    if (isPlaying) {
      // Pausing - save note if changes were made
      saveNoteIfChanged();
    } else if (currentNoteId) {
      // If playing while editing a note, return to course content
      returnToCourseContent();
    }
    setIsPlaying((prev) => !prev);
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
    if (!isPlaying) return;

    const timer = setTimeout(() => setTrackTime((t) => t + 1), 1000);
    const currentTime = `00:${String(trackTime).padStart(2, "0")}`;

    if (trackTime >= timelineEndTime) togglePlayPause();

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

	if (isEditorTouched && tempNoteId && trackTime % 5 === 0) { // Auto-save every 5 seconds
      const currentNote = userNotes.notes.find(note => note.noteId === tempNoteId);
      if (currentNote && currentNote.context !== originalEditorText) {
        console.log("Auto-saving note due to time progression");
        saveNoteIfChanged();
        // Create new temporary note for continued editing
        setIsEditorTouched(true);
        const newTempNoteId = `temp-${Date.now()}`;
        setTempNoteId(newTempNoteId);
        setOriginalEditorText(editorText);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, trackTime]);

  // -------- Render ----------
  return (
    <div className="editModeMainContainer">
      <Toolbar onRun={() => console.log("run")} />

      <div className="editModeSecondaryContainer">
        <div id="one">
          <CourseDetails info={courseInformation} />
          <FilesSection files={courseInformation.files} />
		      <NotesSection userNotes={userNotes} onNoteClick={handleNoteClick}/>
        </div>

        <div id="two" onClick={()=>handleEditorChange}>
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
          {currentNoteId && (
            <div style={{
              padding: '0.5rem',
              backgroundColor: '#e3f2fd',
              border: '1px solid #2196f3',
              borderRadius: '4px',
              marginTop: '0.5rem',
              fontSize: '0.9rem'
            }}>
              📝 Editing Note - Changes are saved automatically
            </div>
          )}
        </div>
		</div>

        <div id="three">
          <p className="containerTitle">Output</p>
          <OutputDisplay outputDisplayVar={outputDisplayVar} />
        </div>
      </div>

      <div className="editModeThreeContainer">
        <button className="toolbarBtn" onClick={togglePlayPause}>
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