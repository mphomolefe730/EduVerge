import { useEffect, useState } from "react"
import StudyGroupService from "../../../services/studyGroup.service"
import UserService from "../../../services/user.service"
import { useNavigate } from "react-router-dom";

export default function ChatMain() {
    const navigate = useNavigate();
    const [pageInformation, setPageinformation] = useState({activePage: "chat", lastRefresh: new Date(), openChat: null });
    
    useEffect(() => {
        const userInformation = UserService.checkLogin();
        if (userInformation){
            console.log(userInformation);
            StudyGroupService.getAllUserGroups(userInformation.id).then((res:any) => {
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
                <h1 className="text-2xl font-bold text-slate-900">Chat Portal</h1>
                <p className="text-slate-600 mt-2">Connect instantly, collaborate effectively, and get real-time support with chat portal.</p>
            </header>            
            <div className="mt-4 bg-white rounded-xl p-5 shadow mb-6">
                <div>
                    {}
                </div>
                <div>{}</div>
            </div>
        </div>
    </div>
    )
}