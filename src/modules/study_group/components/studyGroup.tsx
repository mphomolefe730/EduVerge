import React, { useState, useEffect } from 'react';
import type StudyGroup from '../../../models/studyGroupModel';
import { useNavigate } from "react-router-dom";
import StudyGroupService from '../../../services/studyGroup.service';

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

const Badge = ({ children, type = 'default' }) => {
  const typeStyles = {
    default: 'bg-blue-50 text-blue-600 border-blue-100',
    active: 'bg-green-50 text-green-600 border-green-100',
    warning: 'bg-orange-50 text-orange-600 border-orange-100',
    full: 'bg-red-50 text-red-600 border-red-100'
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-medium ${typeStyles[type]}`}>
      {children}
    </span>
  );
};

const StudyGroupCard = ({ group, onJoin }) => {
  const {
    courseId,
    createdAt,
    createdBy,
    description,
    difficulty,
    groupName,
    id,
    isPublic,
    maxMembers,
    tags,
    updatedAt
  } = group

  // const memberCount = `${members}/${maxMembers}`;
  // const isFull = members >= maxMembers;

  return (
    <div className="bg-white rounded-xl p-5 shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-slate-900">{groupName} <Badge type={difficulty === 'Beginner' ? 'default' : difficulty === 'Intermediate' ? 'warning' : 'active'}>{difficulty}</Badge></h3>
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{description}</p>
          <div className="gap-2 mt-1">
            <p className="text-sm text-slate-600">created on: <Badge>{createdAt}</Badge></p>
            <p className="text-sm text-slate-600">maximum members: <Badge>{maxMembers}</Badge></p>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md">
            #{tags}
          </span>
        {tags.map((tag, index) => (
        ))}
      </div> */}

      <div className="flex justify-between items-center">
        <Button
          onClick={() => onJoin(group)}
          >
          View Group
        </Button>
      </div>
    </div>
  );
};

const FilterSection = ({ filters, onFilterChange }) => {
  const subjects = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Biology', 'Chemistry', 'Engineering'];
  const difficulties = ['All', 'easy', 'medium', 'hard'];
  // const meetingTypes = ['All', 'Weekly', 'Bi-weekly', 'One-time'];

  return (
    <div className="bg-white rounded-xl p-5 shadow mb-6">
      <h3 className="font-semibold text-slate-900 mb-4">Filter Groups</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
          <select 
            value={filters.subject}
            onChange={(e) => onFilterChange('subject', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
          <select 
            value={filters.difficulty}
            onChange={(e) => onFilterChange('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Meeting Type</label>
          <select 
            value={filters.meetingType}
            onChange={(e) => onFilterChange('meetingType', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {meetingTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div> */}
      </div>

      <div className="mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(e) => onFilterChange('onlyAvailable', e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-slate-700">Show only groups with available spots</span>
        </label>
      </div>
    </div>
  );
};


export default function StudyGroupsLayout() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    subject: 'All',
    difficulty: 'All',
    // meetingType: 'All',
    onlyAvailable: false
  });
  
  useEffect(() => {
    StudyGroupService.getAllStudyGroups()
    .then((res:any) => {
      setStudyGroups(res.data);
    })
    .catch((e:any)=>{
      console.log(e)
    });
  },[]);

  const [studyGroups, setStudyGroups] = useState<StudyGroup[]|[]>();

  const handleJoinGroup = (group:any) => {
    navigate(`/view/${group.id}`)
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearchChange = (e:any) => {
    setSearchQuery(e.target.value);
    searchCourse();
  }

  const searchCourse = () => {
    StudyGroupService.searchForStudyGroup(searchQuery).then((res)=>{
      console.log(res);
      setStudyGroups(res.data.results)
    }).catch((err)=>console.log(err))
  }

  const filteredGroups = studyGroups?.filter(group => {
    const matchesSearch = group.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.courseId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = filters.subject === 'All' || group?.groupName === filters.subject;
    const matchesDifficulty = filters.difficulty === 'All' || group?.difficulty === filters.difficulty;

    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-7 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            <Button onClick={() => { navigate("/dashboard")}}>
              VIEW DASHBOARD
            </Button> Study Groups</h1>
          <p className="text-slate-600 mt-2">Join study groups to learn together, share knowledge, and achieve your academic goals</p>
        </header>

        {/* Search Bar */}
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
            {/* <Button onClick={searchCourse}>
                Search
            </Button> */}
            <Button onClick={() => { navigate("/studygroup/create")}}>
              Create New Group
            </Button>
          </div>
        </div>

        {/* Filters */}
        <FilterSection filters={filters} onFilterChange={handleFilterChange} />

        {/* Study Groups Grid */}
        {filteredGroups?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <StudyGroupCard
                key={group.id}
                group={group}
                onJoin={handleJoinGroup}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No study groups found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filters to find more groups</p>
          </div>
        )}
      </div>
    </div>
  );
}