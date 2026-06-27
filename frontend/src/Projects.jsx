import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Stack from 'react-bootstrap/Stack';
import { useNavigate } from "react-router";
import { pullProjects, addProject, updateProject, deleteProject } from "../util/api.js"
import ProjectModel from "./ProjectModel.jsx";
import InfoModal from "./InfoModal.jsx";
import "./Projects.css"

function Projects(){
    let navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const getProjects = async () => {
        try {
            const pulledProjects = await pullProjects("true");
            if(pulledProjects !== undefined){
                setProjects(pulledProjects);
            }
        } catch(err){
            console.error(err)
        }
    }

    const completeProject = async ({name, description, id, completed}) => {
        try {
            const status = await updateProject({name, description, id, completed: !completed})
            if(status === 200){
                getProjects();    
            }
        } catch(err){
            console.error(err);
        }
    }

    const removeProject = async ({id}) => {
        const status = await deleteProject({id})
        if(status === 204){
            getProjects();    
        }
    }

    useEffect(
        () => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            getProjects();
        }, []
    )
    const [projectToAdd, setProjectToAdd] = useState({name: "", description: ""})
    const [showAdd, setShowAdd] = useState(false);

    const addSubmitHandler = async () => {
        try {
            await addProject(projectToAdd);
            getProjects();
        }catch(err){
            console.error(err);
        }
    }

    const [projectToEdit, setProjectToEdit] = useState({name: "", description: ""})
    const [showEdit, setShowEdit] = useState(false);

    const editSubmitHandler = async () => {
        await updateProject(projectToEdit);
        getProjects();
    }

    const showEditModel = (project) => {
        setShowEdit(true)
        setProjectToEdit(project)
    }

    const redirectBtnHandler = (project) => {
        navigate(project.id)
    }
    
    const [showInfo, setShowInfo] = useState(false);
    const [projectInfo, setProjectInfo] = useState({name: "", description: ""})

    const showInfoModel = (project) => {
        setProjectInfo(project);
        setShowInfo(true);
    }
    
    return <>
        <ProjectModel project={projectToAdd} setProject={setProjectToAdd} show={showAdd} setShow={setShowAdd} submitHandler={addSubmitHandler}/>
        <ProjectModel project={projectToEdit} setProject={setProjectToEdit} show={showEdit} setShow={setShowEdit} submitHandler={editSubmitHandler}/>
        <InfoModal project={projectInfo} show={showInfo} setShow={setShowInfo} />
        <div>
            <h1 className="header row-container  align-items-center">
                <span>Projects</span>
                <Button variant="dark" className="btn-circle d-flex flex-column align-items-center justify-content-center" onClick={() => setShowAdd(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                    </svg>
                </Button>
            </h1>    
            <hr className="thick-hr long-hr"/>
            <div className="fixed-height">
                {projects.map(
                    project => {
                        return <div key={project.id}  style={project.completed? {textDecoration: "line-through" } : null}>
                            <div className="project-entry">
                                <div>
                                    <h4>{project.name} </h4>
                                    <p>{project.description.substring(0,100)}{project.description.length > 100 ? '...' : ''}</p>
                                </div>
                                <div>
                                    <Stack direction="horizontal" gap={2}>
                                        <Button variant="dark" className="align-icon" onClick={() => showInfoModel(project)} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-lg" viewBox="0 0 16 16">
                                                <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0"/>
                                            </svg>
                                        </Button>
                                        <Button variant="dark" className="align-icon" onClick={() => showEditModel(project)} >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"></path>
                                            </svg>
                                        </Button>
                                        <Button variant="dark" className="align-icon"  onClick={() => completeProject(project)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"></path>
                                            </svg>
                                        </Button>
                                        <Button variant="dark" className="align-icon" onClick={() => removeProject(project)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                                            </svg>
                                        </Button>
                                        <Button variant="dark" className="align-icon" onClick={() => redirectBtnHandler(project)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-forward" viewBox="0 0 16 16">
                                            <path d="M9.502 5.513a.144.144 0 0 0-.202.134V6.65a.5.5 0 0 1-.5.5H2.5v2.9h6.3a.5.5 0 0 1 .5.5v1.003c0 .108.11.176.202.134l3.984-2.933.042-.028a.147.147 0 0 0 0-.252l-.042-.028zM8.3 5.647a1.144 1.144 0 0 1 1.767-.96l3.994 2.94a1.147 1.147 0 0 1 0 1.946l-3.994 2.94a1.144 1.144 0 0 1-1.767-.96v-.503H2a.5.5 0 0 1-.5-.5v-3.9a.5.5 0 0 1 .5-.5h6.3z"></path>
                                            </svg>
                                        </Button>
                                    </Stack>
                                </div>
                            </div>
                            <hr />
                        </div>
                    }
                )}          
            </div>
        </div>
    </>
}

export default Projects;