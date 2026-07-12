/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import Stack from "react-bootstrap/Stack";
import { hourMinSecondsMilli, formatDigit } from "../util";
import "./StopWatch.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TaskInfo from "./TaskInfo";
import { deleteTask, updateTask } from "../util/api";

function StopWatch({task, setTask}){
    const [time, setTime] = useState(task.milliseconds);
    const [intialTime, setInitalTime] = useState(task.milliseconds)
    const [start, setStart] = useState(null);
    const [show, setShow] = useState(false);
    const [active, setActive] = useState(false);

    const saveUpdatedTask = async () => {
        try{
            console.log(task)
            await updateTask(task.project_id, task.id, {...task, milliseconds: time})
            setTask({...task, milliseconds: time})
        }
        catch(err){
            console.error(err)
        }
    }
    useEffect(() =>{
        let interval;
        if(active){
            interval = setInterval(() => {
                const now = new Date()
                setTime((now - start))//adds 10 milliseconds every 10milliseconds 
            }, 10)
        } else {
            saveUpdatedTask()
        }
        return () => clearInterval(interval);
    }, [time, active])

    const pauseHandler = async () => {
        if(active){
            setActive(false)
            setInitalTime(time);
        } else {
            setActive(true)  
            setStart(new Date(Date.now() - intialTime));
        }
    }
    
    const doneHandler = async () => {
        try {
            await updateTask(task.project_id, task.id, {...task, milliseconds: time, complete: new Date()})
            setTask(null)
        } catch(err){
            console.error(err)
        }
    }

    const deleteHandler = async () => {
        try {
            await deleteTask(task.project_id, task.id)
            setTask(null)
        } catch(err){
            console.error(err)
        }
    }
    const {hour, min, sec, milliseconds} = hourMinSecondsMilli(time);

    return <>
        <TaskInfo task={task} show={show} setShow={setShow}/>
        <div className="stopwatch-container box-info">
            <div className="d-flex flex-column align-items-center gap-3">
                <div className="d-flex flex-row align-items-center  gap-2">
                    <div className="task-name">{task.name}</div> <Button variant="outline-dark" className="info-icon" onClick={() => {setShow(true)}}>i</Button>
                </div>
                <div className="stopwatch-time">
                    <div>
                        <span>{formatDigit(hour)}</span>:<span>{formatDigit(min)}</span>:<span>{formatDigit(sec)}</span>:<span>{formatDigit(milliseconds).substring(0,2)}</span>
                    </div>
                </div>
                <div>
                    <Stack direction="horizontal" gap={2}>
                        <Button variant="outline-dark" onClick={pauseHandler}>
                            {active? "Pause" : "Start"}
                        </Button>
                        <Button variant="outline-dark" onClick={doneHandler}>Save</Button>
                        <Button variant="outline-dark" onClick={deleteHandler}>Delete</Button>
                    </Stack>
                </div>
            </div>
        </div>
    </>
}
export default StopWatch;