import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import HomePage from './modules/homepage/components/homepage.tsx';
import InteractiveMode from './modules/interactive_mode/components/interactiveMode.tsx';
import EditMode from './modules/editor_mode/components/editorMode.tsx';
import EditCollection from './modules/editor_mode/components/editCollection.tsx';
import EditModeForm from './modules/editor_mode/components/editModeForm.tsx';
import Dashboard from './modules/dashboard/components/dashboard.tsx';
import Login from './modules/shared/auth/login.tsx';
import Register from './modules/shared/auth/register.tsx';
import StudyGroupsLayout from './modules/study_group/components/studyGroup.tsx';
import StudyGroupsCreate from './modules/study_group/components/studyGroupCreate.tsx';
import ChatMain from './modules/chat/components/chatMain.tsx';
import ChatView from './modules/chat/components/chatView.tsx';

const router = createBrowserRouter([
  { 
    path: '/', 
    element: <HomePage/>,
    errorElement: <div><p>404 NOT FOUND</p></div>
  },{
    path: '/dashboard',
    element: <Dashboard/>,
  },{
    path: '/login',
    element: <Login/>,
  },{
    path: '/register',
    element: <Register/>,
  },{
    path: '/interactive/:courseCollection/:courseName',
    element: <InteractiveMode/>,
  },{
    path: '/create',
    element: <EditModeForm />
  },{
    path:'/chats',
    element: <ChatMain/>
  },{
    path:'/view/:chatId',
    element: <ChatView/>
  },{
    path: '/edit/:courseCollection/:courseId/:courseName',
    element: <EditMode/> 
  },{
    path: '/collection/edit/:courseCollection',
    element: <EditCollection/>
  },{
    path: '/studygroup',
    element: <StudyGroupsLayout/>
  },{
    path: '/studygroup/create',
    element: <StudyGroupsCreate/>
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
