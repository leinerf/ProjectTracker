
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ProjectModel from "./ProjectModel";
import { updateProject, deleteProject, getProjectTime } from "../util/api";
import { useNavigate } from "react-router";
import { hourMinSecondsMilliString } from "../util";

function ProjectDetails({project, setProject, tab}) {    
    const [editProject, setEditProject] = useState({})
    const [show, setShow] = useState(false)
    const [timeSpent, setTimeSpent] = useState({
        total: 0,
        yearly: 0,
        monthly: 0,
        weekly: 0,
        daily: 0
    })
    const navigate = useNavigate();
    const submitHandler = async () =>{
        try {
            await updateProject(editProject);
            setProject(editProject)
        } catch(err){
            console.error(err);
        }
    }

    const deleteHandler = async () =>{
        try {
            deleteProject(editProject);
            navigate("../")
        }catch(err){
            console.error(err);
        }
    }

    const pullProjectTime = async () =>{
        const data = await getProjectTime(project)
        const {total, yearly, monthly, weekly, daily } = data
        setTimeSpent({total, yearly, monthly, weekly, daily})
    }

    useEffect(() => {
        if(tab === "details"){
            // eslint-disable-next-line react-hooks/set-state-in-effect
            pullProjectTime();    
        }
    }, [tab])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEditProject({...project})
    }, [project])
    
    return <>
        <ProjectModel project={editProject} setProject={setEditProject} show={show} setShow={setShow} submitHandler={submitHandler}/>
        <div className="mb-3 d-flex flex-row gap-3" >
            <Button variant="dark" onClick={() => setShow(true)}>Edit</Button>
            <Button variant="dark" onClick={deleteHandler}>Delete</Button>
        </div>
        <div className='mb-3'>
            <h2 className='fw-bold mb-3'>Due Date, Priority, And Status</h2>
            <div className='mb-2'>Due Date: {project.due_date && project.due_date.substring(0,10)}</div>
            <div className='mb-2'>Priority: {project.priority}</div>
            <div className='mb-2'>Status: {project.status}</div>
        </div>

        <div className='mb-3'>
            <div className="mb-3">
                <h2 className='fw-bold'>Time Spent</h2>
                <p className="text-muted">hours:minutes:seconds</p>
            </div>
            
            
            <div className='mb-2'>Total: <span>{hourMinSecondsMilliString(timeSpent.total, false)}</span></div>
            <div className='mb-2'>Yearly: <span>{hourMinSecondsMilliString(timeSpent.yearly, false)}</span></div>
            <div className='mb-2'>Monthly: <span>{hourMinSecondsMilliString(timeSpent.monthly, false)}</span></div>
            <div className='mb-2'>Weekly: <span>{hourMinSecondsMilliString(timeSpent.weekly, false)}</span></div>
            <div className='mb-2'>Daily: <span>{hourMinSecondsMilliString(timeSpent.daily, false)}</span></div>
        </div>

        <div className='mb-3'>
            <h2 className='fw-bold mb-3'>Description</h2>
            <p>{project.description}</p>
        </div>
    </>
}

export default ProjectDetails