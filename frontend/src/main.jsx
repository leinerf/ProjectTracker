import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

//components
import App from './App.jsx';
import GoogleAuth from "./GoogleAuth.jsx";
import Ping from "./Ping.jsx";
import Tasks from './Tasks.jsx';
import Task from './Task.jsx';
import ProjectNav from './Navbar.jsx';

//styling
import './index.css'
import StopWatch from './StopWatch.jsx';
import { pullTasks } from '../util/api.js';
import Authenticated from './Authenticated.jsx';

async function  createTaskRoutes(){
  const tasks = await pullTasks()
  if(tasks === null){
    return [];
  }
  return tasks.map((task) => {
    return <Route path={task.id} element={<Task task={task}/>} />
  })
}


createRoot(document.getElementById('root')).render(
  <>
  
  <BrowserRouter>
  <ProjectNav/>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/google-signup" element={<GoogleAuth redirectURL="/" authPath="google-signup" />} />
      <Route path="/google-signin" element={<GoogleAuth redirectURL="/" authPath="google-signin"/>} />
      <Route path="/ping" element={<Ping/>}/>
      <Route path="/projects" element={<Authenticated/>} >
        <Route path="/" >
            <Route index element={<Tasks/>} />
            {createTaskRoutes()}
          </Route>
          <Route path="/stopwatch" element={<StopWatch/>}/>
      </Route>
        
        
        
      
      
    </Routes>
  </BrowserRouter>
  </>
)