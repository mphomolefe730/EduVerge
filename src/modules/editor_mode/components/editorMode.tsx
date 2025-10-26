import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause } from "@fortawesome/free-regular-svg-icons";
import { EditorView, basicSetup } from "codemirror";
import type { EditModeSettings } from "../../../configs/editModeSettings.ts";
import fileTypes from "../../../configs/fileTypes.ts";
import type InteractiveModeModel from "../../../models/interactiveModeModel.ts";

// ---------- Toolbar ----------
const Toolbar = ({ onRun }: { onRun: () => void }) => (
  <div className="editModeSubContainer">
    <p className="containerTitle">Tool Bar</p>
    <div className="toolbarElements">
      <button className="toolbarBtn" onClick={onRun} type="button">
        <FontAwesomeIcon size="2x" icon={faCirclePlay} />
        <p>Run</p>
      </button>
    </div>
  </div>
);

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
  const { courseName = "", courseCollection = "" } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackTime, setTrackTime] = useState(0);
  const [minute, setMinute] = useState(0);
  const [editorText, setEditorText] = useState("");
  const [outputDisplayVar, updateOutputDisplayVar] = useState("");

  const handleEditorChange = (newText: string) => {
    setEditorText(newText);
  };

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
        text: [{ time: "00:00", context: "<p>welcome to</p><h1>EDU VERGE</h1>", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        text: [{ time: "00:03", context: "<p>my name:</p><h1>Mpho Molefe</h1>", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      },
      {
        text: [{ time: "00:08", context: "what will you learn:", run: true }],
        curse: { time: "", x: 0, y: 0 },
        fileType: fileTypes.HTML,
        fileName: "index"
      }
    ],
    audio: [
      { time: "00:00", audioLink: "/src/assets/audio/welcome.ogg", audioStartTime: "00:00", audioEndTime: "00:07" },
      { time: "00:07", audioLink: "/src/assets/audio/courseOverview_pt1.ogg", audioStartTime: "00:01", audioEndTime: "00:07" }
    ]
  });

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

  const togglePlayPause = () => setIsPlaying((prev) => !prev);

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
        } else if (t.time === currentTime && !t.run) {
          setEditorText(t.context);
        }
      });
    });

    courseInformation.audio.forEach((a) => {
      if (a.time === currentTime) playAudioSegment(a.audioLink, a.audioStartTime, a.audioEndTime);
    });

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
        </div>

        <div id="two">
          <MainEditor main={courseInformation.main} editorText={editorText} onChange={handleEditorChange} />
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