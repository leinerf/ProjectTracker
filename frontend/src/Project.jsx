import React, {useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import StopWatch from './StopWatch';
import { useLocation, useParams } from 'react-router';
import { addTask, updateTask, getProject, pullTasks } from '../util/api';
import { hourMinSecondsMilli, formatDigit } from "../util";

function Project({projectId}) {
    const [number, setNumber] = useState(0);
    const [project, setProject] = useState({})
    
    const params = useParams()
    const {projectId: id } = params
    const pullProject = async (id) => {    
        const pulledProject = await getProject({ id });
        setProject(pulledProject);
    }

    useEffect(() => {
        pullProject(id)
    }, [])

    const [tasks, setTasks] = useState([]);
    const getTasks = async (id) => {
        const pulledTasks = await pullTasks(id);
        pulledTasks.sort
        setTasks(pulledTasks)

    }

    useEffect(() => {
        getTasks(id);
    }, [])

    const [task, setTask] = useState({detail: ""})
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setTask({...task, task: ""})
        setShow(false)
    };
    const handleShow = () => setShow(true);
    const handleChange = (event) => {
        const {name, value} = event.target;
        setTask({...task, [name]: value});
    }
    
    const handleSave = () => {
        const start = new Date()
        const detail = task.detail;
        addTask(id, {detail, start})
        getTasks(id)
        handleClose();
    }


    const activeTasksList = () => {
        const activeTasks = tasks.filter((task) => task.finish === null)
        return activeTasks.map(task => {
            const editTask = (task) => {
                updateTask(id, task.id, task)
                getTasks(id)
            }
            return (
                <div key={task.id}>
                    <div>{task.detail}</div>
                    <div>
                        <StopWatch task={task} editTask={editTask}/>
                    </div>
                </div>
            )
        })
    }

    const finishedTasksList = () => {
        const finishedTasks = tasks.filter(task => task.finish !== null);
        finishedTasks.sort((a, b) => new Date(a.start) - new Date(b.start))
        return finishedTasks
    }
    
    const bucketTasksByDate = () => {
        const tasks = finishedTasksList();
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
            {activeTasksList()}
            
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