import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { addTask } from '../util/api';

function TaskModal({projectId, show, setShow}) {
    const handleClose = () => setShow(false);
    const [task, setTask] = useState({name: "", detail: ""})

    const changeHandler = (event) => {
        const {name, value} = event.target;
        setTask({...task, [name]: value})
    }

    const submitHandler = () => {
        addTask(projectId, task)
        setTask({name: "", detail: ""})
        setShow(false);
    }

    return (
    <Modal show={show} onHide={handleClose}>
        <Form>
            <Modal.Header closeButton>
                <Modal.Title>New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Name: </Form.Label>
                    <Form.Control type="text" placeholder="task name" name={"name"} value={task.name} onChange={changeHandler}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Detail: </Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="More details on task" name={"detail"} value={task.detail} onChange={changeHandler}/>
                </Form.Group>
            </Modal.Body>
            
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="dark" onClick={submitHandler}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Form>
    </Modal>
  );
}

export default TaskModal;