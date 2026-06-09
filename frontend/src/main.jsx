import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

//components
import App from './App.jsx';
import GoogleAuth from "./GoogleAuth.jsx";
import Ping from "./Ping.jsx";
import Tasks from './Tasks.jsx';
import Task from './Task.jsx';

//styling
import './index.css'
import StopWatch from './StopWatch.jsx';
import { pullTasks } from '../util/api.js';

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
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/google-signup" element={<GoogleAuth redirectURL="/" authType="google-signup" />} />
      <Route path="/google-signin" element={<GoogleAuth redirectURL="/" authType="google-signin"/>} />
      {localStorage.getItem("authenticated")? 
        <>
        <Route path="/ping" element={<Ping/>}/>
        <Route path="/tasks" >
          <Route index element={<Tasks/>} />
          {createTaskRoutes()}
        </Route>
        </>
      : null}
      <Route path="/stopwatch" element={<StopWatch/>}/>
    </Routes>
  </BrowserRouter>,
)