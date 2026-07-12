/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import {  useParams } from 'react-router';
import { formatDigit, hourMinSecondsMilli } from "../util";
import { getProject } from '../util/api';


import './Project.css'
import './StopWatch.css'
import ProjectDetails from './ProjectDetails';
import ProjectSession from './ProjectSession';

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

    const bucketTasksByDate = () => {
        let oldDate;
        const bucket = {}
        finishedTasks.forEach(task => {
            const newDate = new Date(task.start).toDateString();
            if(oldDate === undefined || oldDate !== newDate){
                oldDate = newDate;
                bucket[oldDate] = []
            }
            bucket[oldDate].push(task)
        })
        const sortedKeys = Object.keys(bucket)
        return { sortedKeys, bucket }
    }

    const createTaskListByDate = () => {
        const { sortedKeys, bucket } = bucketTasksByDate();
        return sortedKeys.map((key,index)  => {
            const tasks = bucket[key];
            return <div key={index}>
                <h1 className="start-date-header">{key}</h1>
                <hr/>
                {tasks.map((task) => {
                    const {hour, min, sec, milliseconds} = hourMinSecondsMilli(task.milliseconds)
                    return (
                        <div key={task.id} className='task-container'>
                            <div  className="active-task-entry d-flex flex-row justify-content-between align-items-center mb-3 flex-wrap">
                                <div className="task-detail">
                                    {task.detail.substring(0, 50)}{task.detail.length > 50 ? '...': null}
                                </div>
                                <div className="d-flex flex-row flex-wrap gap-2">
                                    <Button variant="outline-dark" onClick={() => showTaskModel(task)}>Info</Button>
                                    <div className="stopwatch-time">
                                        <span>{formatDigit(hour)}</span>:<span>{formatDigit(min)}</span>:<span>{formatDigit(sec)}</span>:<span>{formatDigit(milliseconds).substring(0,2)}</span>
                                    </div>    
                                </div>  
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </div>
        })
    }

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
            </div>
            {/* <div className="mb-3">
                <p>Description: {project.description ? project.description.substring(0, 200) + (project.description.length > 100 ? '...' : '') : 'No description available'}</p>
                <Button variant="dark" className="align-icon " onClick={() => showInfoModel(project)}> Expand Description</Button>
            </div>
            <div className="mb-3">
                <p>Total Time Spent: <span className="fw-bold">{formatDigit(hour)}:{formatDigit(min)}:{formatDigit(sec)}:{formatDigit(milliseconds).substring(0,2)}</span></p>
            </div>
            <hr className="thick-hr long-hr"/>
            <div className="row-container">
                <h1 className="tab" onClick={() => {showTaskType("inProgress")}} style={taskType === "inProgress" ? {textDecoration: "underline"} : null} >InProgress</h1>
                <h1 className="tab" onClick={() => {showTaskType("finished")}} style={taskType === "finished" ? {textDecoration: "underline"} : null}>Finished</h1>
            </div>
            <div className="fixed-height">    
                <div className="mt-3">
                    {taskType === "inProgress" ?  activeTasksList(): null}
                    {taskType === "finished" ? createTaskListByDate() : null}
                </div>
            </div> */}
        </div>
    </>
}

export default Project;