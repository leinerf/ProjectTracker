import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";
import { getProjects, addProject, updateProject, deleteProject } from "../util/api.js"
import ProjectModel from "./ProjectModel.jsx";
import InfoModal from "./InfoModal.jsx";
import Form from 'react-bootstrap/Form';

import "./Projects.css"

function Projects(){
    let navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [sortOption, setSortOption] = useState("createdAt");
    const [projectStatus, setProjectStatus] = useState("inProgress");
    const sortingOptions = ["name", "priority", "due_date", "createdAt"]
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(10)

    
    const pullProjects = async (sort, offset, limit, status) => {
        try {
            const pulledProjects = await getProjects(sort, offset, limit, status);
            if(pulledProjects !== undefined){
                setProjects(pulledProjects);
            }
        } catch(err){
            console.error(err)
        }
    }
    
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        pullProjects(sortOption, 0, 10, status)
    }, [sortOption])

    useEffect(
        () => {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            pullProjects();
        }, []
    )

    const [projectToAdd, setProjectToAdd] = useState({name: "", description: ""})
    const [showAdd, setShowAdd] = useState(false);

    const addSubmitHandler = async () => {
        try {
            const resp = await addProject(projectToAdd);
            resp.project && setProjects([...projects, resp.project].sort(sortFns[sortFn]));
        }catch(err){
            console.error(err);
        }
    }

    const [projectToEdit, setProjectToEdit] = useState({name: "", description: ""})
    const [showEdit, setShowEdit] = useState(false);

    const showEditModel = (project) => {
        setProjectToEdit(project);
        setShowEdit(true);
    }

    const editSubmitHandler = async () => {
        try {
            const resp = await updateProject(projectToEdit);
            if (resp.project) {
                setProjects(projects.map(p => p.id === resp.project.id ? resp.project : p).sort(sortFns[sortFn]));
            }
        } catch(err){
            console.error(err);
        }
    }

    const deleteHandler = async (project) => {
        try {
            const resp = await deleteProject(project);
            if(resp === 204) {
                setProjects(projects.filter(p => p.id !== project.id));
            }
            // TODO delete project in projects state instead of pulling all projects again
        }catch(err){
            console.error(err);
        }
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
    
    const filteredProjects = projects.filter(project => project.status ===  projectStatus);
    console.log(filteredProjects)
    return <>
        <ProjectModel project={projectToAdd} setProject={setProjectToAdd} show={showAdd} setShow={setShowAdd} submitHandler={addSubmitHandler} type="add"/>
        <ProjectModel project={projectToEdit} setProject={setProjectToEdit} show={showEdit} setShow={setShowEdit} submitHandler={editSubmitHandler} type="edit"/>
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
                <select name="sort" className="selector" value={sortFn} onChange={(e) => setSortFn(e.target.value)}> 
                    {Object.keys(sortFns).map((key) => {
                        return <option className="sort-option" key={key} value={key}>{key}</option>
                    })}
                </select>
                <select name="status" className="selector" value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
                    <option value="inProgress">inProgress</option>
                    <option value="completed">completed</option>
                </select>
            </div>
            <hr className="thick-hr long-hr"/>
            
            <div className="fixed-height column-container">
                {filteredProjects.map(
                    project => {
                        return <div  key={project.id}  style={project.completed? {textDecoration: "line-through" } : null}>
                            <div className="d-flex justify-content-between flex-wrap align-items-center">
                                <div>
                                    <h4>{project.name.substring(0, 10)}{project.name.length > 10 ? "..." : ""}</h4>
                                </div>
                                <div className="row-container d-flex gap-2 align-items-center flex-wrap">
                                    <button className="box-info" onClick={() => showInfoModel(project)} >
                                        <span>Details</span>
                                    </button>  
                                    <div className="box-info due-date" >
                                        <span>Due: {project.due_date ? project.due_date.substring(0, 10) : "No due date"}</span>
                                    </div>
                                    <div className="box-info priority" >
                                        <span>Priority: {project.priority}</span>
                                    </div>
                                    <button className="box-info" onClick={() => redirectBtnHandler(project)}>
                                        <span>Manage</span>
                                    </button>
                                    <button className="box-info" onClick={() => showEditModel(project)}>
                                        <span>Edit</span>
                                    </button>
                                    <button className="box-info" onClick={() => deleteHandler(project)}>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                            <hr />
                        </div>
                    }
                )}
                <div className="align-self-center">
                    <button className="box-info" onClick={() => console.log("load more")}>
                        <span>Load more</span>
                    </button>
                </div>       
            </div>
        </div>
    </>
}

export default Projects;