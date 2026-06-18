/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import {  useParams } from 'react-router';
import { formatDigit, hourMinSecondsMilli } from "../util";
import { addTask, deleteTask, getProject, getTasks, updateTask } from '../util/api';
import StopWatch from './StopWatch';
import InfoModal from './InfoModal';

import './Project.css'

const TaskInfoModel = ({task, handleClose, show}) => {
    const {hour, min, sec, milliseconds: milli} = hourMinSecondsMilli(task.milliseconds)
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header >
                <Modal.Title>{task.detail}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    <li>Start time: {new Date(task.start).toLocaleDateString()} - {new Date(task.start).toLocaleTimeString()}</li>
                    <li>Finish time: {new Date(task.finish).toLocaleDateString()} - {new Date(task.finish).toLocaleTimeString()}</li>
                    <li>Total time: {`${formatDigit(hour)}:${formatDigit(min)}:${formatDigit(sec)}:${formatDigit(milli).substring(0,2)}`}</li>
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

function Project() {
    const [project, setProject] = useState({});
    const [tasks, setTasks] = useState([]);
    const [activeTasks, setActiveTasks] = useState([]);
    const [finishedTasks, setFinishedTasks] = useState([]);
    const [task, setTask] = useState({detail: ""});
    const [active, setActive] = useState(null)
    const [show, setShow] = useState(false);
    const params = useParams()
    const {projectId: id } = params
    
    const pullProject = async (id) => {    
        const pulledProject = await getProject({ id });
        setProject(pulledProject);
    }

    const pullTasks = async (id) => {
        const pulledTasks = await getTasks(id);
        setTasks(pulledTasks)
    }

    useEffect(() => {
        pullProject(id)
    }, [])    

    useEffect(() => {
        pullTasks(id);
    }, [])

    useEffect( () => {
        setActiveTasks(tasks.filter((task) => task.finish === null))
        setFinishedTasks(tasks.filter((task) => task.finish !== null))
    }, [tasks])

    const handleClose = () => {
        setTask({...task, detail: ""})
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setTask({...task, [name]: value});
    }
    
    const handleSave = async() => {
        const start = new Date()
        const detail = task.detail;
        await addTask(id, {detail, start})
        await pullTasks(id)
        handleClose();
    }

    const editTask = async (task) => {
        await updateTask(id, task.id, task)
        await pullTasks(id)
    }
    const removeTask = async (task) => {
        await deleteTask(id, task.id);
        await pullTasks(id)
    }

    const [showTaskInfo, setShowTaskInfo] = useState(false);
    const [taskInfo, setTaskInfo] = useState({})
    const showTaskModel = ({detail, start, milliseconds, finish}) => {
        setShowTaskInfo(true);
        setTaskInfo({detail, start, milliseconds, finish});
    }
    const hideTaskModel = () => {
        setShowTaskInfo(false);
        setTaskInfo({})
    }

    const activeTasksList = () => {
        return activeTasks.map(task => {
            return (
                <div key={task.id} className="active-task-entry d-flex flex-row justify-content-between align-items-center mb-3">
                    <div>
                        {task.detail}
                    </div>
                    <div>
                        <Stack direction="horizontal" gap={2}>
                            <Button variant="outline-dark" onClick={() => showTaskModel(task)}>Info</Button>
                            <StopWatch task={task} editTask={editTask} active={active} setActive={setActive}/>
                            <Button variant="outline-dark" onClick={() => removeTask(task)}>Delete</Button>
                        </Stack>
                    </div>  
                </div>
            )
        })
    }

    const bucketTasksByDate = () => {
        const tasks = finishedTasks.sort((a, b) => new Date(a.start) - new Date(b.start))
        let oldDate;
        const bucket = {}
        tasks.forEach(task => {
            const newDate = new Date(task.start).toDateString();
            if(oldDate === undefined || oldDate !== newDate){
                oldDate = newDate;
                bucket[oldDate] = []
            }
            bucket[oldDate].push(task)
        })
        const sortedKeys = Object.keys(bucket).sort((a, b) => new Date(a) - new Date(b));
        return { sortedKeys, bucket }
    }

    const createTaskListByDate = () => {
        const { sortedKeys, bucket } = bucketTasksByDate();
        return sortedKeys.map((key,index)  => {
            const tasks = bucket[key];
            return <div key={index}>
                <h1>{key}</h1>
                <ul>
                    {tasks.map((task,jndex) => {
                        const {hour, min, sec, milliseconds} = hourMinSecondsMilli(task.milliseconds)
                        return (
                            <li key={`${index}-${jndex}`}>
                                    <h3>{task.detail}</h3>
                                    <ul>
                                        <li>Start time: {new Date(task.start).toLocaleDateString()} - {new Date(task.start).toLocaleTimeString()}</li>
                                        <li>finish time: {new Date(task.finish).toLocaleDateString()} - {new Date(task.finish).toLocaleTimeString()}</li>
                                        <li>time: {`${formatDigit(hour)}:${formatDigit(min)}:${formatDigit(sec)}:${formatDigit(milliseconds).substring(0,2)}`}</li>
                                        <li>
                                            <Button variant="danger" onClick={() => removeTask(task)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                                                </svg>
                                            </Button>
                                        </li>
                                    </ul>
                            </li>
                        )
                    })}
                </ul>
            </div>
        })
    }

    const [showInfo, setShowInfo] = useState(false);
    const [projectInfo, setProjectInfo] = useState({name: "", description: ""})

    const showInfoModel = (project) => {
        setProjectInfo(project);
        setShowInfo(true);
    }
    
    return <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label >New Task</Form.Label>
                <Form.Control name='detail' value={task.detail} onChange={handleChange}/>
                <Form.Text muted>
                    Write down the task you want to work on.
                </Form.Text>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        <InfoModal project={projectInfo} show={showInfo} setShow={setShowInfo} />
        <TaskInfoModel task={taskInfo} show={showTaskInfo} handleClose={hideTaskModel}/>
        {/* <div className="center-content">
            <div className="d-flex flex-row align-items-center gap-3">
                <h1>{project.name}</h1>
                <Button variant="dark" className="align-icon" onClick={() => showInfoModel(project)} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-lg" viewBox="0 0 16 16">
                        <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0"/>
                    </svg>
                </Button>
            </div>
            <div>
                <p>Total Hours Spent: <span>10:40:30:20</span></p>
            </div>
            <div>
                <Button variant='primary' onClick={handleShow}>Create Task</Button>
            </div>
            <div>
                <h1>Active Sessions</h1>
                <div>
                    {activeTasksList()}
                </div>
            </div>
            <div>
                <h1>Completed Sessions</h1>
                <div>
                    {createTaskListByDate()}
                </div>
            </div>
        </div> */}
        <div>
            <div className="mb-3 row-container  align-items-center">
                <h1 className="header"><span>{project.name}</span></h1>
                <Button variant="dark" className="btn-circle d-flex flex-column align-items-center justify-content-center" onClick={handleShow}>
                    <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                    </svg>
                </Button>
            </div>
            
            <div className="mb-3">
                <p>Description: {project.description ? project.description.substring(0, 200) + (project.description.length > 100 ? '...' : '') : 'No description available'}</p>
                <Button variant="dark" className="align-icon " onClick={() => showInfoModel(project)}> Expand Description</Button>
            </div>
            <div className="mb-3">
                <p>Total Time Spent: <span className="fw-bold">10:40:30:20</span></p>
            </div>
            
            <hr className="thick-hr long-hr"/>
            <div className="row-container">
                <h1 style={{ textDecoration: "underline" }}>InProgress</h1>
                <h1>Finished</h1>
            </div>
            <div className="fixed-height">    
                <div className="mt-3">
                    {activeTasksList()}
                </div>
            </div>
        </div>
    </>
}

export default Project;