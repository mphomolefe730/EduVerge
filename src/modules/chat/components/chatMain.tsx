import { useEffect, useState } from "react"
import StudyGroupService from "../../../services/studyGroup.service"
import UserService from "../../../services/user.service"
import { useNavigate } from "react-router-dom";

export default function ChatMain() {
    const navigate = useNavigate();
    const [pageInformation, setPageinformation] = useState({activePage: "chat", lastRefresh: new Date(), openChat: null });
    const [studyGroups, setStudyGroups] = useState([]);
    
    useEffect(() => {
        const userInformation = UserService.checkLogin();
        if (userInformation){
            StudyGroupService.getAllUserGroups(userInformation.id).then((res:any) => {
                setStudyGroups(res.data);
            }).catch((e:any)=>{console.log(e)})
        }else{
            navigate("/login"); 
        }
    },[]);
    
    return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-7 text-slate-900">
        <div className="max-w-6xl mx-auto">   
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Chat Portal</h1>
                <p className="text-slate-600 mt-2">Connect instantly, collaborate effectively, and get real-time support with chat portal.</p>
            </header>            
            <div className="mt-4 bg-white rounded-xl p-5 shadow mb-6">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Your Study Groups | <small> last refresh ({pageInformation.lastRefresh.toTimeString().slice(0, 5)})</small></h2>
                    <div className="space-y-4">
                        {studyGroups.map((group) => (
                            <div key={group.id} className="p-4 rounded-lg border border-slate-100 bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-slate-900">{group.groupName}</h3>
                                        <p className="text-sm text-slate-600 mt-1">{group.description}</p>
                                        <div className="flex gap-2 mt-2">
                                            <span className="inline-block px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs">
                                                {group.difficulty}
                                            </span>
                                            <span className="inline-block px-2 py-1 rounded-full bg-slate-50 text-slate-600 text-xs">
                                                {group.maxMembers} members max
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { navigate(`/view/${group.id}`)}}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:opacity-95"
                                    >
                                        Open Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}