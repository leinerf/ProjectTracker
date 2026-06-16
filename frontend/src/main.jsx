import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

//components
import Home from './Home.jsx';
import GoogleAuth from "./GoogleAuth.jsx";
import Ping from "./Ping.jsx";
import Projects from './Projects.jsx';
import Project from './Project.jsx';
import ProjectNav from './Navbar.jsx';
import Authenticated from './Authenticated.jsx';

//styling
import './index.css'

createRoot(document.getElementById('root')).render(<>
  <BrowserRouter>
    <ProjectNav/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/google-signup" element={<GoogleAuth redirectURL="/" authPath="google-signup" />} />
      <Route path="/google-signin" element={<GoogleAuth redirectURL="/" authPath="google-signin"/>} />
      <Route path="/ping" element={<Ping/>}/>
      <Route path="/projects" element={<Authenticated/>} >
        <Route index element={<Projects/>} />
        <Route path=":projectId" element={<Project />} />
      </Route>
    </Routes>
  </BrowserRouter>
</>)