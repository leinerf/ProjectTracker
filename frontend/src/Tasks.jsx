import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/esm/Button";

function Tasks(){
    const [tasks, setTasks] = useState([]);
    useEffect(
        () => {
            const pullTasks = async () => {
                const resp = await axios.get("/api/task")
                if(resp.status === 200){
                    setTasks([...resp.data.tasks]);
                }
            }
            pullTasks();
            
        }, []
    )

    return <>
        <ul>
            {tasks.map((task, index) => <li key={index}>{task}</li>)}
        </ul>
        <Button onClick={() => setTasks([...tasks, 'e'])}>Click to add more letters</Button>
    </>
}

export default Tasks;