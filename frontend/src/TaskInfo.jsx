import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { formatDateTime } from "../util";

function TaskInfo({task, show, setShow}) {
    const handleClose = () => setShow(false);
    
    return <>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Task Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className='mb-3'>
                    <span className='fw-bold'>Name</span>: <br/>
                    {task.name}
                </p>
                <p className='mb-3'>
                    <span className='fw-bold'>Details</span>: <br/>
                    {task.detail}
                </p>
                <p className='mb-3'>
                    <span className='fw-bold'>Created Date & Time</span>: <br/>
                    {task.createdAt && formatDateTime(task.createdAt)}
                </p>

                {task.complete ? 
                    <p className='mb-3'>
                        <span className='fw-bold'>Completed Date & Time</span>: <br/>
                        {task.complete && formatDateTime(task.complete)}
                    </p>: null 
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default TaskInfo;
