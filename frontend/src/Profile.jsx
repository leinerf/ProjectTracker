import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { getClientAuth, setClientAuth } from "../util/auth.js";
import { useNavigate } from "react-router";
import "./Profile.css"

function Profile() {
    const navigate = useNavigate();
    const {username, email } = getClientAuth();
    const [show, setShow] = useState(false);
    const [usrname, setUserName] = useState(username);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const onUsrnameChange = (event) => {
        const { value } = event.target
        setUserName(value)
    }
    const handleSubmit = async(event) => {
        event.preventDefault()
        handleClose();
        const resp = await axios.put("/api/user", { username:usrname })
        if(resp.status === 200){
            setClientAuth({ username: resp.data.username })
            setUserName(resp.data.username)
        } else {
            throw Error("status code was not 200: " + resp.status)
        }
    }

    const goToProjects = (event) => {
        event.preventDefault();
        navigate("/projects")
    }

    return <>
        <div>
            <Modal show={show} onHide={handleClose}>
                <Form>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder={usrname} onChange={onUsrnameChange} value={usrname}/>
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
        </div>
        <div>
            <h1>Hello <span className="bold-text">{usrname}</span>
                <svg onClick={handleShow} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"></path>
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"></path>
                </svg>
                , lets get started on tracking your projects</h1>
            <p className="description">We have your email as {email}.</p>
            <p className="description">You worked on your project for <span className="bold-text">2 hours 45 minutes 30 seconds</span> today.</p>
            <Button variant="dark" onClick={goToProjects}>
                Go to Projects
            </Button>
        </div>
    </>


}

export default Profile;