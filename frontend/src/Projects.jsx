import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from "react-router";
import { pullProjects, addProject, updateProject, deleteProject } from "../util/api.js"

function ProjectModel({project, setProject, show, setShow, submitHandler}) {
    const [valid, setValid] = useState({})
    const [showErrors, setShowErrors] = useState(false)
    
    useEffect(() => {
        if(show){
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setValid({
                name: project.name.length !== 0 ? true : false,
                description: project.description.length !== 0 ? true: false
            })
        }
    }, [show])

    const handleClose = () => {
        setShowErrors(false);
        setShow(false);
    };
    const editProject = (event) => {
        const {name, value} = event.target
        setProject({...project, [name]: value});
        setValid({...valid,[name]: value.length !== 0 })
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        if(Object.values(valid).includes(false)){
            setShowErrors(true);
        } else {            
            submitHandler();
            setProject({name: "", description: ""})
            setShow(false)
            setShowErrors(false);
        }
        
    }

    const inputErrors = () => {
        const errors = []
        Object.keys(valid).forEach((inputName, index) => {
            if(valid[inputName]){
                return
            }
            errors.push(<Alert key={index} variant="danger">
                {inputName} is an empty string
            </Alert>)
        })
        return errors
    }
    
    return <>
        <Modal show={show} onHide={handleClose}>
            { showErrors ? inputErrors() : null }    
            <Form>
                <Modal.Header closeButton>
                <Modal.Title>New Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form.Group className="mb-3" >
                            <Form.Label>Project</Form.Label>
                            <Form.Control type="text" placeholder="type the name of the project you want to work on"  name={"name"} value={project.name} onChange={editProject} required={true} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a username.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="type a description of the project you want to work on" name={"description"} value={project.description} onChange={editProject} required={true}/>
                        </Form.Group>
                    
                    
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button type="submit" variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
}

function Projects(){
    let navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    
    const getProjects = async () => {
        try {
            const pulledProjects = await pullProjects();
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
        if(status === 200){
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
    return <>
        <ProjectModel project={projectToAdd} setProject={setProjectToAdd} show={showAdd} setShow={setShowAdd} submitHandler={addSubmitHandler}/>
        <ProjectModel project={projectToEdit} setProject={setProjectToEdit} show={showEdit} setShow={setShowEdit} submitHandler={editSubmitHandler}/>
        <div className="center-content">
            <Card >
                <Card.Header>
                    <h1>Add Project
                        <Button varient="primary" onClick={() => setShowAdd(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                        </Button>
                    </h1>
                </Card.Header>
                <Card.Body>
                    <div>
                        <ul>
                            {projects.map(
                                project => {
                                    return <li key={project.id}  style={project.completed? {textDecoration: "line-through" } : null}>
                                        <div>
                                            <div>
                                                <h4>{project.name} </h4>
                                                <p>{project.description}</p>
                                            </div>
                                            <div>
                                                <Stack direction="horizontal" gap={2}>
                                                    <Button variant="success" onClick={() => showEditModel(project)} >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"></path>
                                                        </svg>
                                                    </Button>
                                                    <Button onClick={() => completeProject(project)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                                                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"></path>
                                                        </svg>
                                                    </Button>
                                                    <Button variant="danger" onClick={() => removeProject(project)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                                                        </svg>
                                                    </Button>
                                                    <Button variant="primary" onClick={() => redirectBtnHandler(project)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-forward" viewBox="0 0 16 16">
                                                        <path d="M9.502 5.513a.144.144 0 0 0-.202.134V6.65a.5.5 0 0 1-.5.5H2.5v2.9h6.3a.5.5 0 0 1 .5.5v1.003c0 .108.11.176.202.134l3.984-2.933.042-.028a.147.147 0 0 0 0-.252l-.042-.028zM8.3 5.647a1.144 1.144 0 0 1 1.767-.96l3.994 2.94a1.147 1.147 0 0 1 0 1.946l-3.994 2.94a1.144 1.144 0 0 1-1.767-.96v-.503H2a.5.5 0 0 1-.5-.5v-3.9a.5.5 0 0 1 .5-.5h6.3z"></path>
                                                        </svg>
                                                    </Button>
                                                </Stack>
                                            </div>
                                        </div>
                                        <hr />
                                    </li>
                                }
                            )}
                        </ul>
                    </div>    
                </Card.Body>
            </Card> 
        </div>
    </>
}

export default Projects;