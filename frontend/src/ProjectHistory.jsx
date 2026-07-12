import { useState } from "react";
import TaskInfo from "./TaskInfo";
import { hourMinSecondsMilli, formatDigit } from "../util";
import Button from "react-bootstrap/Button"
import { useEffect } from "react";
import { getTasks } from "../util/api";

function ProjectHistory({projectId}) {
    const [tasks, setTasks] = useState([])
    const [task, setTask] = useState({})
    const [show, setShow] = useState(false)

    const pullTasks = async() => {
        const pulledTasks = await getTasks(projectId)
        console.log(pulledTasks)
        if(pulledTasks){
            
            setTasks([...pulledTasks]);
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        console.log("it went here")
        pullTasks();
        
    }, [])

    const bucketTasksByDate = () => {
        let oldDate;
        const bucket = {}
        tasks.forEach(task => {
            const newDate = new Date(task.createdAt).toDateString();
            if(oldDate === undefined || oldDate !== newDate){
                oldDate = newDate;
                bucket[oldDate] = []
            }
            bucket[oldDate].push(task)
        })
        const sortedKeys = Object.keys(bucket)
        return { sortedKeys, bucket }
    }

    const createTaskListByDate = () => {
        const { sortedKeys, bucket } = bucketTasksByDate();
        return sortedKeys.map((key,index)  => {
            const tasks = bucket[key];
            return <div key={index}>
                <h1 className="start-date-header">{key}</h1>
                <hr/>
                {tasks.map((task) => {
                    const {hour, min, sec, milliseconds} = hourMinSecondsMilli(task.milliseconds)
                    return (
                        <div key={task.id} className='task-container'>
                            <div  className="active-task-entry d-flex mb-3 flex-wrap">
                                <Button variant="outline-dark" className="info-icon" onClick={() => showTaskModel(task)}>i</Button>
                                <div className="task-detail">
                                    {task.detail.substring(0, 50)}{task.detail.length > 50 ? '...': null}
                                </div>
                                
                                    
                                    <div className="">
                                        <span>{formatDigit(hour)}</span>:<span>{formatDigit(min)}</span>:<span>{formatDigit(sec)}</span>:<span>{formatDigit(milliseconds).substring(0,2)}</span>
                                    </div>    
                                
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </div>
        })
    }

    const showTaskModel = (task) => {
        setShow(true)
        setTask(task)
    }
    console.log(tasks)
    return <>
        <TaskInfo task={task} show={show} setShow={setShow}/>
        <h1>hello from Project History</h1>
        <div className="fixed-height">    
            <div className="mt-3">
                 {createTaskListByDate()}
            </div>
        </div>

    </>
}

export default ProjectHistory;