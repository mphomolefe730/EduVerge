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

export default function ViewAllCourses() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
const handleOpeningCourse = (courseName: string, courseCollect: string) => {
  const link = `/interactive/${courseCollect}/${courseName}`; 
  navigate(link.replace(/\s+/g, '-'));
};
const CourseCard = ({ course }: { course: Course }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow hover:shadow-md transition-shadow cursor-pointer hover:transform hover:scale-[1.02] duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">{course.courseName}</h3>
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{course.courseDescription}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Prerequisites:</span>
          <span className="font-medium">{course.prerequisites} courses</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-500">Price:</span>
          <span className="font-medium text-green-600">${course.price}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-500">Access Period:</span>
          <span className="font-medium">{course.accessPeriod} days</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-slate-500">Collection:</span>
          <span className="font-medium text-blue-600">{course.courseCollection}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Course ID: {course.id}</span>
          <button onClick={()=>handleOpeningCourse(course.courseName, course.courseCollection)} className="text-sm px-3 py-1">
            Watch Course
          </button>
        </div>
      </div>
    </div>
  );
};
  const searchCourse = () => {
    CourseService.getAllCourses()
      .then((res: any) => {
        const filteredCourses = res.data.filter((course: Course) => 
          course.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.courseDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.courseCollection.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setCourses(filteredCourses);
      })
      .catch((err: any) => console.log(err));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Search when searchQuery changes (with debounce)
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        searchCourse();
      } else {
        // If search query is empty, load all courses
        CourseService.getAllCourses()
          .then((res: any) => {
            setCourses(res.data);
          })
          .catch((err: any) => console.log(err));
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  useEffect(() => {
    CourseService.getAllCourses()
      .then((res: any) => {
        setCourses(res.data);
      })
      .catch((err: any) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-7 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Button onClick={() => { navigate("/dashboard") }} className="!p-1">
              <FontAwesomeIcon size="lg" icon={faSquareCaretLeft} /> 
            </Button> 
            COURSES
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
                placeholder="Search courses by name, description, course ID or collection..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Button onClick={() => { navigate("/create") }}>
            Create New Course
          </Button>
        </div>
      </div>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-slate-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No courses found</h3>
          <p className="text-slate-500 mb-4">Try adjusting your search or filters to find more courses</p>
        </div>
      )}
    </div>
  );
}