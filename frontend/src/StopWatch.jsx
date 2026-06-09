import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

function StopWatch({task}){
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [intRef, setIntRef] = useState(undefined);    
    const [delay, setDelay] = useState(false);

    useEffect(() =>{
        if(running){
            if(!delay){
                setIntRef(setTimeout(() => {
                    setTime(time + 1);
                    setDelay(false)
                }, 1000))
                setDelay(true)
            }
        } else {
            clearTimeout(intRef);
            setIntRef(undefined);
            setDelay(false);
        }
    }, [running, delay])
    

    // format this better
    const hourMinSec = (seconds) => {
        let sec = seconds
        const hour = Math.floor(sec/(60 * 60))
        sec -= hour * (60 * 60)
        const min = Math.floor(sec/60);
        sec -= min * 60
        
        return {hour, min, sec}
    }
    const formatDigit = (time) =>  {
        if (time === 0){
            return "00";
        } else if(time <= 9) {
            return `0${time}`;
        } else {
            return `${Math.floor(time / 10)}${time % 10}`
        }
    }

    const stopHandler = () => {
        setRunning(false)
        // data entry
        setTime(0)
    }
    const {hour, min, sec} = hourMinSec(time);
    return <>
        <div className="stopwatch-card">
            <div className ="stopwatch">
                <Stack gap={3}>
                    <div><span>{hour}</span>:<span>{formatDigit(min)}</span>:<span>{formatDigit(sec)}</span></div>
                    <Button onClick={() => {setRunning(!running)}}>{!running ? "start" : "pause"}</Button>
                    <Button variant="danger" onClick={stopHandler}>Stop</Button>
                </Stack>
                
            </div>
            
        </div>
    </>
}
export default StopWatch;