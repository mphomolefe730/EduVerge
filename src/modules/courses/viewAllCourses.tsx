import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretLeft } from "@fortawesome/free-regular-svg-icons";
import type Course from '../../models/courseModel';
import CourseService from "../../services/course.service.ts";

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

export default function ViewAllCourses(){
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]|[]>();

  const searchCourse = () => {
    CourseService.getAllCourses()
    .then((res:any)=>{
      console.log(res.data);
      // setCourses(res.data.results)
    })
    .catch((err:any)=>console.log(err))
  }
  
  const handleSearchChange = (e:any) => {
    setSearchQuery(e.target.value);
    searchCourse();
  }

  useEffect(()=>{
    CourseService.getAllCourses()
    .then((res:any)=>{
      console.log(res.data);
      setCourses(res.data);
    })
    .catch((err:any)=>console.log(err))
  },[])

  return(
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-7 text-slate-900">
          <div className="max-w-6xl mx-auto">
              <header className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">
                  <Button onClick={() => { navigate("/dashboard")}}>
                      <FontAwesomeIcon size="2x" icon={faSquareCaretLeft}/> 
                  </Button> COURSES
              </h1>
              <p className="text-slate-600 mt-2">Find Your Path: Courses Designed to Empower Your Success</p>
              </header>
          </div>
          <div className="bg-white rounded-xl p-5 shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search study groups by name, description, course ID or tags..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Button onClick={() => { navigate("/create")}}>
                Create New Course
              </Button>
            </div>
          </div>
      </div>
  )
}