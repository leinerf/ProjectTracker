import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

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
            <Form>
                <Modal.Header closeButton>
                <Modal.Title>{project.id ? "Edit Project" : "New Project"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        { showErrors ? inputErrors() : null }    
                        <Form.Group className="mb-3" >
                            <Form.Label>Project</Form.Label>
                            <Form.Control type="text" placeholder="type the name of the project you want to work on"  name={"name"} value={project.name} onChange={editProject} required={true} />
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="type a description of the project you want to work on" name={"description"} value={project.description} onChange={editProject} required={true}/>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" name={"due_date"} value={ project.due_date ? project.due_date.substring(0, 10) : ""} onChange={editProject} required={true}/>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Priority</Form.Label>
                                <Form.Select aria-label="priority select" name={"priority"} value={project.priority} onChange={editProject} required={true}>
                                    <option value="">Select a priority</option>
                                    {Array.from({length: 9}, (_, i) => 9 - i).map(
                                        (num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        )
                                    )}
                                </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Status</Form.Label>
                            <Form.Select aria-label="status select" name={"status"} value={project.status} onChange={editProject} required={true}>
                                <option value="">Select a status</option>
                                <option value="inProgress">InProgress</option>
                                {project.id && (
                                    <option value="completed">Completed</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    <span>Close</span>
                </Button>
                <Button type="submit" variant="dark" onClick={handleSubmit}>
                    <span>Save</span>
                </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
}

export default ProjectModel;