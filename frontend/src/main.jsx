import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

//components
import App from './App.jsx';
import GoogleAuth from "./GoogleAuth.jsx";
import Ping from "./Ping.jsx";
import Tasks from './Tasks.jsx';

//styling
import './index.css'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/google-signup" element={<GoogleAuth redirectURL="/" authType="google-signup" />} />
      <Route path="/google-signin" element={<GoogleAuth redirectURL="/" authType="google-signin"/>} />
      <Route path="/ping" element={<Ping/>}/>
      <Route path="/tasks" element={<Tasks/>}/>
    </Routes>
  </BrowserRouter>,
)