import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

import { pullTasks, addTask, updateTask, deleteTask } from "../util/api.js"

function TaskModel({task, setTask, show, setShow, submitHandler}) {
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const editTask = (event) => {
        const {name, value} = event.target
        setTask({...task, [name]: value});
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        submitHandler();
        setTask({name: "", description: ""})
    }
    return <>
            <Modal show={show} onHide={handleClose}>
                <Form>
                    <Modal.Header closeButton>
                    <Modal.Title>New Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Task</Form.Label>
                            <Form.Control type="text" placeholder="type task here"  name={"name"} value={task.name} onChange={editTask}/>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Example textarea</Form.Label>
                            <Form.Control as="textarea" rows={3} name={"description"} value={task.description} onChange={editTask} />
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

function Tasks(){
    const [tasks, setTasks] = useState([]);
    
    const getTasks = async () => {
        const pulledTasks = await pullTasks();
        setTasks(pulledTasks);
    }

    const completeTask = async ({name, description, id, completed}) => {
        const status = await updateTask({name, description, id, completed: !completed})
        if(status === 200){
            getTasks();    
        }
    }

    const removeTask = async ({id}) => {
        const status = await deleteTask({id})
        if(status === 200){
            getTasks();    
        }
    }

    useEffect(
        () => {
            getTasks();
        }, []
    )
    const [taskToAdd, setTaskToAdd] = useState({name: "", description: ""})
    const [showAdd, setShowAdd] = useState(false);

    const addSubmitHandler = async () => {
        await addTask(taskToAdd);
        getTasks();
    }

    const [taskToEdit, setTaskToEdit] = useState({name: "", description: ""})
    const [showEdit, setShowEdit] = useState(false);

    const editSubmitHandler = async () => {
        await updateTask(taskToEdit);
        getTasks();
    }

    const showEditModel = (task) => {
        setShowEdit(true)
        setTaskToEdit(task)
    }
    return <>

    <TaskModel task={taskToAdd} setTask={setTaskToAdd} show={showAdd} setShow={setShowAdd} submitHandler={addSubmitHandler}/>
    <TaskModel task={taskToEdit} setTask={setTaskToEdit} show={showEdit} setShow={setShowEdit} submitHandler={editSubmitHandler}/>
    <div className="center-content">
        <Card >
            <Card.Header>
                <h1>Add Task
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
                        {tasks.map(
                            task => {
                                return <li key={task.id}  style={task.completed? {textDecoration: "line-through" } : null}>
                                    <div>
                                        <div>
                                            <h4>{task.name} </h4>
                                            <p>{task.description}</p>
                                        </div>
                                        <div>
                                            <Stack direction="horizontal" gap={2}>
                                                <Button variant="success" onClick={() => showEditModel(task)} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"></path>
                                                    </svg>
                                                </Button>
                                                <Button onClick={() => completeTask(task)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                                                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"></path>
                                                    </svg>
                                                </Button>
                                                <Button variant="danger" onClick={() => removeTask(task)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
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

export default Tasks;