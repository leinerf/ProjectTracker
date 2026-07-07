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
            <div className="row-container">
                <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>In Progress</span>
                <span>Completed</span>
            </div>
            <hr className="thick-hr long-hr"/>
            <div className="fixed-height">
                {projects.map(
                    project => {
                        return <div key={project.id}  style={project.completed? {textDecoration: "line-through" } : null}>
                            <div className="project-entry">
                                <Stack direction="horizontal" gap={2}>
                                    <button className="box-info" onClick={() => showInfoModel(project)} >
                                        <span>I</span>
                                    </button>   
                                    <h4>{project.name}</h4>
                                </Stack>
                                <div>
                                    <Stack direction="horizontal" gap={2}>
                                        
                                        <button className="box-info due-date">
                                            <span>03/20/2027</span>
                                        </button>
                                        <button className="box-info priority">
                                            <span>9</span>
                                        </button>
                                        <button className="box-info" onClick={() => redirectBtnHandler(project)}>
                                            <span>Manage</span>
                                        </button>
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