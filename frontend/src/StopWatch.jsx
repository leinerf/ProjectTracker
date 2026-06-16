import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { hourMinSecondsMilli, formatDigit } from "../util";

function StopWatch({task, editTask, active, setActive}){
    const [time, setTime] = useState(task.milliseconds);   
    const [delay, setDelay] = useState(false);
    const [intervalRef, setIntervalRef] = useState(undefined);

    useEffect(() =>{
        if(active === task.id){
            setIntervalRef(setInterval(() => {
                setTime(time + 1)//adds 10 milliseconds every 10milliseconds 
            }, 1))
        } else {
            editTask({...task, milliseconds: time})
        }

        return () => clearInterval(intervalRef);
    }, [time, active])

    const pauseHandler = async () => {
        if(active === task.id){
            setActive(null)
        } else {
            setActive(task.id)
        }
    }
    
    const doneHandler = () => {
        setRunning(false)
        editTask({...task, milliseconds: time, finish: new Date()})
    }

    const {hour, min, sec, milliseconds} = hourMinSecondsMilli(time);

    return <>
        <div className ="stopwatch">
            <div><span>{formatDigit(hour)}</span>:<span>{formatDigit(min)}</span>:<span>{formatDigit(sec)}</span>:<span>{formatDigit(milliseconds).substring(0,2)}</span></div>
            <div>
                <Stack direction="horizontal">
                    <button onClick={pauseHandler}>{active === task.id ? "pause" : "start"}</button>
                    <button  onClick={doneHandler}>Done</button>
                </Stack>
            </div>
        </div>
    </>
}
export default StopWatch;