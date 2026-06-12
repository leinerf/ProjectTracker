import React, {useState} from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { clearClientAuth, isAuthenticated } from '../util/auth';
import axios from 'axios';
import { useNavigate } from "react-router";

function ProjectNav(){
    const navigate = useNavigate();
    const logoutHandler = async() => {
        const resp = await axios.get("/auth/logout");
        if(resp.status === 200){
            clearClientAuth();
            navigate("/")
            window.location.reload("/");
        }
    }
    const brandHandler = () => {
        navigate("/projects")
    }
    return <>
        <Navbar expand="lg" className="bg-body-tertiary" style={{marginBottom: "50px"}}>
            <Container>
                <Navbar.Brand onClick={brandHandler}>Project</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                <Nav>
                    <NavDropdown title="User" id="basic-nav-dropdown" >
                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </>
}

export default ProjectNav;