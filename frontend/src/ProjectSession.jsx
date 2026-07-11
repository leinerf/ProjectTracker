import { useState } from "react";
import Button from "react-bootstrap/Button";
import TaskModal from "./TaskModal";
import StopWatch from "./StopWatch";
function ProjectSession({projectId}) {
    const [show, setShow] = useState(false);
    const [task, setTask] = useState({name: "testing name", detail: "testing detail", milliseconds: 99999})
    const [active, setActive] = useState(false);
    console.log(projectId)
    return <>
        <TaskModal  projectId={projectId} show={show} setShow={setShow}/>
        <Button variant="dark" onClick={ () => setShow(true) }>Start Session</Button>
        <div className="d-flex flex-column justify-content-center align-items-center">
            <StopWatch task={task} editTask={setTask} active={active} setActive={setActive}/>
        </div>
        
    </>
}

export default ProjectSession;