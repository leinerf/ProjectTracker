/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import Stack from "react-bootstrap/Stack";
import { hourMinSecondsMilli, formatDigit } from "../util";
import "./StopWatch.css";
import Button from "react-bootstrap/Button";

function StopWatch({task, editTask, active, setActive}){
    const [time, setTime] = useState(task.milliseconds);   
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
        editTask({...task, milliseconds: time, finish: new Date()})
    }

    const {hour, min, sec, milliseconds} = hourMinSecondsMilli(time);

    return <>
        <div className="stopwatch row-container align-items-center gap-2">
            <div className="stopwatch-time">
                <span>{formatDigit(hour)}</span>:<span>{formatDigit(min)}</span>:<span>{formatDigit(sec)}</span>:<span>{formatDigit(milliseconds).substring(0,2)}</span>
            </div>
            <div>
                <Stack direction="horizontal" gap={2}>
                    <Button variant="outline-dark" onClick={pauseHandler}>
                        {active === task.id ? "Stop" : "Start"}
                    </Button>
                    <Button variant="outline-dark" onClick={doneHandler}>End</Button>
                </Stack>
            </div>
        </div>
    </>
}
export default StopWatch;