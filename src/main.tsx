import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import HomePage from './modules/homepage/components/homepage.tsx';
import InteractiveMode from './modules/interactive_mode/components/interactiveMode.tsx';

const router = createBrowserRouter([
  { 
    path: '/', 
    element: <HomePage/>,
    errorElement: <div><p>404 NOT FOUND</p></div>
  },{
    path: '/interactive/:courseId/:courseSection',
    element: <InteractiveMode/>,
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
