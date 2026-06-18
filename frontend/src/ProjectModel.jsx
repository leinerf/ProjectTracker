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
                <Button type="submit" variant="dark" onClick={handleSubmit}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
}

export default ProjectModel;