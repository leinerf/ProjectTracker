import React, {useState, useEffect } from 'react';
import StopWatch from './StopWatch';

function Task({task}) {
    const {name, description, id, completed} = task
    return <>
    <div className="center-content">
        <div>
            <h1>{name}</h1>
        </div>
        <div>
            <StopWatch task={task}/>
        </div>
    </div>
        
    </>
}

export default Task;