/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import {  useParams } from 'react-router';
import { getProject } from '../util/api';


import './Project.css'
import './StopWatch.css'
import ProjectDetails from './ProjectDetails';
import ProjectSession from './ProjectSession';
import ProjectHistory from "./ProjectHistory";

function Project() {
    const [project, setProject] = useState({});
    const [tab, setTab] = useState("session");
    const params = useParams()
    const {projectId: id } = params
    
    const pullProject = async (id) => {    
        const pulledProject = await getProject({ id },"true");
        setProject(pulledProject);
    }
    
    useEffect(() => {
        pullProject(id)
    }, [])    

    return <>        
        <div>
            <div className="mb-3">
                <h1 className="header"><span>{project.name}</span></h1>
                <div className="mb-3 row-container">
                    <div className='fw-bold tab' onClick={()=> {setTab("session")}} style={tab === "session" ? {textDecoration: "underline"} : null}>Session</div>
                    <div className='fw-bold tab' onClick={()=> {setTab("details")}} style={tab === "details" ? {textDecoration: "underline"} : null}>Details</div>
                    <div className='fw-bold tab' onClick={()=> {setTab("history")}} style={tab === "history" ? {textDecoration: "underline"} : null}>History</div>
                </div>
            </div>
            <hr className="thick-hr long-hr"/>
            <div className='container'>
                {tab === "details" && <ProjectDetails project={project} setProject={setProject}/>}
                {tab === "session" && <ProjectSession projectId={id}/>}
                {tab === "history" && <ProjectHistory projectId={id} tab={tab}/>}
            </div>
        </div>
    </>
}

export default Project;