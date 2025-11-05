import { useEffect, useState } from "react"
import StudyGroupService from "../../../services/studyGroup.service"
import UserService from "../../../services/user.service"
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretLeft } from "@fortawesome/free-regular-svg-icons";

const Button = ({ children, variant = 'solid', onClick, className = '' }) => {
  const base = 'px-4 py-2 rounded-lg font-semibold focus:outline-none';
  const solid = 'bg-blue-600 text-white hover:opacity-95';
  const ghost = 'bg-transparent border border-blue-100 text-blue-600';
  return (
    <button onClick={onClick} className={`${base} ${variant === 'ghost' ? ghost : solid} ${className}`}>
      {children}
    </button>
  );
};

export  default function StudyGroupView(){
    const { groupId } = useParams();
    const [userInformation, setUserInformation] = useState([]);
    const navigate = useNavigate();
    const [studyGroup, setStudyGroup] = useState([]);

    const handleJoin = () =>{
        StudyGroupService.joinStudyGroup(groupId, userInformation.id).then((r)=>{
            console.log(r)
        })
    }
    
    useEffect(() => {
        const userInformation = UserService.checkLogin();
        setUserInformation(userInformation)
        if (userInformation){
            StudyGroupService.getStudyGroup(groupId).then((res:any) => {
                setStudyGroup(res.data);
                console.log(res.data);
            }).catch((e:any)=>{console.log(e)})
        }else{
            navigate("/login"); 
        }
    },[]);
     return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-7 text-slate-900">
        <div className="max-w-6xl mx-auto">   
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">{studyGroup.groupName}</h1>
                <p className="text-slate-600 mt-2">{studyGroup.description}</p>
                <p className="text-slate-600 mt-2">course id: {studyGroup.courseId}</p>
                <p className="text-slate-600 mt-2">created at: {studyGroup.createdAt}</p>
                <p className="text-slate-600 mt-2">max memebers: {studyGroup.maxMembers}</p>
                
                <h1 className="text-2xl font-bold text-slate-900">
                    <Button onClick={handleJoin}> 
                        JoinGroup
                    </Button> 
                </h1>
            </header>   
        </div>
    </div>
    )
}