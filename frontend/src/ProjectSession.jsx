import { useState } from "react";
import Button from "react-bootstrap/Button";
import TaskModal from "./TaskModal";
import StopWatch from "./StopWatch";
import { useEffect } from "react";
import { getSessionTask } from "../util/api";
function ProjectSession({projectId}) {
    const [show, setShow] = useState(false);
    const [task, setTask] = useState(null)
    
    const pullSessionTask = async() => {
        try{
            const data = await getSessionTask(projectId);
            if(data && data.task !== null){
                setTask(data.task)
            }
        } catch(err){
            console.log(err)
        }
        
    }
    
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        pullSessionTask()
    }, [])

    return <>
        <TaskModal updateSessionTask={setTask} projectId={projectId} show={show} setShow={setShow}/>
        {task === null? 
        <Button variant="dark" onClick={ () => setShow(true)} >Start Session</Button>:
        <Button variant="dark"  disabled>Start Session</Button>
        }
        
        {task !== null? <div className="d-flex flex-column justify-content-center align-items-center">
            <StopWatch task={task} setTask={setTask}/>
        </div> : null
        }
        
        
    </>
}

export default ProjectSession;