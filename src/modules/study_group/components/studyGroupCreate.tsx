import { useState } from "react";
import type StudyGroup from "../../../models/studyGroupModel";
import GroupService from "../../../services/group.service";

export default function StudyGroupCreate(){    
    const [form, setForm] = useState({ groupName: "", description: "", difficulty: "easy", maximumNumber: 10, isPublic: "true" });

    const handleChange = (e:any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    const HandleSubmit = (e:any) => {
        e.preventDefault();
        const newErrors = [];
        const token = sessionStorage.getItem('EduVergeToken');
        if(!token){
            console.log("No token found");
            return
        };
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const userInformation = JSON.parse(jsonPayload);

        if (form.groupName === "" || form.description === "" || form.difficulty === "") {
            newErrors.push("Please fill all fields");
            return;
        }
        GroupService.createNewGroup({
            id: "",
            groupName: form.groupName,
            description: form.description,  
            courseId:"course_1762040463826",
            createdBy: userInformation.id,
            createdAt: new Date(),
            difficulty: form.difficulty,
            maxMembers: form.maximumNumber,
            isPublic: form.isPublic === "true" ? true : false,
        }).then((res:any) => {
            console.log(res)
        }).catch(err=> console.log(err.request.response));
        return;
    }

return(
        
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-7 text-slate-900">
      <div className="max-w-6xl mx-auto">   
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create Study Groups</h1>
          <p className="text-slate-600 mt-2">Start your own study group to collaborate, connect with peers, and drive your collective success.</p>
        </header>
        
        <form onSubmit={HandleSubmit} method="post" className="mt-4 bg-white rounded-xl p-5 shadow mb-6">
            <label>Group Name:</label>
            <input name="groupName" onChange={handleChange} className="w-full mt-2 px-3 py-2 border rounded-md" placeholder="Enter study group name" />
            <label>Description:</label>
            <input name="description" onChange={handleChange} className="w-full mt-2 px-3 py-2 border rounded-md" placeholder="Describe the purpose and goals of your group" />
            <label>Difficulty</label>
            <select name="difficulty"  onChange={handleChange} className="w-full mt-2 px-3 py-2 border rounded-md">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
            <label>Maximum Numbers</label>
            <select name="maximumNumber" onChange={handleChange} className="w-full mt-2 px-3 py-2 border rounded-md">
                <option value="10">below 10</option>
                <option value="25">below 25</option>
                <option value="50">below 50</option>
                <option value="100">below 100</option>
                <option value="999999">No Limit</option>
            </select>
            <label>Public or Private</label>
            <select name="maximumNumber" onChange={handleChange} className="w-full mt-2 px-3 py-2 border rounded-md">
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>
            <input type="submit" value="CREATE" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"/>
        </form>
      </div>
    </div>
    );
}