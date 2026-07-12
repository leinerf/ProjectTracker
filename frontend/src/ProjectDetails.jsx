
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ProjectModel from "./ProjectModel";
import { updateProject, deleteProject } from "../util/api";
import { useNavigate } from "react-router";

function ProjectDetails({project, setProject}) {    
    const [editProject, setEditProject] = useState({})
    const [show, setShow] = useState(false)

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

    useEffect(() => {
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
            <h2 className='fw-bold mb-3'>Time Spent</h2>
            <div className='mb-2'>Total: <span>40:57:23:88</span></div>
            <div className='mb-2'>Yearly: <span>45:40:20:10</span></div>
            <div className='mb-2'>Monthly: <span>20:32:23:87</span></div>
            <div className='mb-2'>Weekly: <span>13:32:23:13</span></div>
        </div>

        <div className='mb-3'>
            <h2 className='fw-bold mb-3'>Description</h2>
            <p>{project.description}</p>
        </div>
    </>
}

export default ProjectDetails