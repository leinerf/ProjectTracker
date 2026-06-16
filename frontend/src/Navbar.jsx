import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { clearClientAuth } from '../util/auth';
import axios from 'axios';
import { useNavigate } from "react-router";
import {isAuthenticated} from '../util/auth.js';
import './Navbar.css';

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
    
    const profileHandler = () => {
        navigate("/")
    }
    
    return <>
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" id="project-nav">
            <Container>
                <Navbar.Brand onClick={brandHandler}>Project</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                {isAuthenticated() && 
                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end"> 
                        <Nav>
                            <NavDropdown title="User" id="basic-nav-dropdown" >
                                <NavDropdown.Item onClick={profileHandler}>Profile</NavDropdown.Item>
                                
                                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                }
            </Container>
        </Navbar>
    </>
}

export default ProjectNav;