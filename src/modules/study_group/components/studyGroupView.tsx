import { useEffect, useState } from "react"
import StudyGroupService from "../../../services/studyGroup.service"
import UserService from "../../../services/user.service"
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export  default function StudyGroupView(){
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [studyGroup, setStudyGroup] = useState([]);
    
    useEffect(() => {
        const userInformation = UserService.checkLogin();
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
            </header>            
            <div className="mt-4 bg-white rounded-xl p-5 shadow mb-6">
                <div>
                    
                </div>
            </div>
        </div>
    </div>
    )
}