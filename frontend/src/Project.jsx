import React, {useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import StopWatch from './StopWatch';
import { useLocation, useParams } from 'react-router';
import { addTask, updateTask, deleteTask, getProject, getTasks } from '../util/api';
import { hourMinSecondsMilli, formatDigit } from "../util";

function Project({projectId}) {
    const [number, setNumber] = useState(0);
    const [project, setProject] = useState({})
    const [tasks, setTasks] = useState([]);
    const [activeTasks, setActiveTasks] = useState([]);
    const [finishedTasks, setFinishedTasks] = useState([])
    const [task, setTask] = useState({detail: ""})
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

    const activeTasksList = () => {
        return activeTasks.map(task => {
            return (
                <div key={task.id}>
                    <div>
                        <Stack direction="horizontal" gap={3}>
                            <div>
                                {task.detail}
                            </div>
                            <Button variant="danger" onClick={() => removeTask(task)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
                                </svg>
                            </Button>
                        </Stack>
                    </div>
                    <div>
                        <StopWatch task={task} editTask={editTask}/>
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
        <div className="center-content">
            <div>
                <h1>{project.name}</h1>
            </div>
            <div>
                <p>{project.description}</p>
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
        </div>
    </>
}

export default Project;