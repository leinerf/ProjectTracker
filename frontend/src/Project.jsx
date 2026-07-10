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
import './StopWatch.css'
import ProjectDetails from './ProjectDetails';

const TaskInfoModel = ({task, handleClose, show}) => {
    const {hour, min, sec, milliseconds: milli} = hourMinSecondsMilli(task.milliseconds)
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header >
                <Modal.Title>{task.detail}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    <li>Created Datetime: {new Date(task.start).toLocaleDateString()} - {new Date(task.start).toLocaleTimeString()}</li>
                    {task.finish ? <li>Finish Datetime: {new Date(task.finish).toLocaleDateString()} - {new Date(task.finish).toLocaleTimeString()}</li> : null }
                    <li>Total Time Spent: {`${formatDigit(hour)}:${formatDigit(min)}:${formatDigit(sec)}:${formatDigit(milli).substring(0,2)}`}</li>
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
    const [editProject, setEditProject] = useState({})
    const [tasks, setTasks] = useState([]);
    const [activeTasks, setActiveTasks] = useState([]);
    const [finishedTasks, setFinishedTasks] = useState([]);
    const [task, setTask] = useState({detail: ""});
    const [active, setActive] = useState(null)
    const [show, setShow] = useState(false);
    const [time, setTime] = useState(0);

    // refactor stuff
    const [tab, setTab] = useState("details")
    const params = useParams()
    const {projectId: id } = params
    
    const pullProject = async (id) => {    
        const pulledProject = await getProject({ id },"true");
        setProject(pulledProject);
        setEditProject(pulledProject);
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
        pullProject(id)
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
                <div key={task.id} className='task-container'>
                    <div  className="active-task-entry d-flex flex-row justify-content-between align-items-center mb-3 flex-wrap">
                        <div className="task-detail">
                            {task.detail.substring(0, 50)}{task.detail.length > 50 ? '...': null}
                        </div>
                        <div className="d-flex flex-row flex-wrap gap-2 btn-container">
                            <Stack direction="horizontal" gap={2}> 
                                <Button variant="outline-dark" onClick={() => showTaskModel(task)}>Info</Button>
                                <Button variant="outline-dark" onClick={() => removeTask(task)}>Delete</Button>
                            </Stack>
                            <StopWatch task={task} editTask={editTask} active={active} setActive={setActive}/>
                        </div>  
                    </div>
                    <hr />
                </div>
            )
        })
    }

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

    const [showInfo, setShowInfo] = useState(false);
    const [projectInfo, setProjectInfo] = useState({name: "", description: ""})

    const showInfoModel = (project) => {
        setProjectInfo(project);
        setShowInfo(true);
    }
    
    const [taskType, setTaskType] = useState("inProgress")
    const showTaskType = (taskType) => {
        setTaskType(taskType);
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
            <Button variant="dark" onClick={handleSave}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        <InfoModal project={projectInfo} show={showInfo} setShow={setShowInfo} />
        <TaskInfoModel task={taskInfo} show={showTaskInfo} handleClose={hideTaskModel}/>
        
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
                {tab === "details" && <ProjectDetails project={project}/>}
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