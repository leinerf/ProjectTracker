import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";

function InfoModal({project, show, setShow}) {
    const handleClose = () => {
        setShow(false);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header >
                <Modal.Title>Project Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className='mb-3'>
                    <span className='fw-bold'>Project</span>: <br/>
                    {project.name}
                </p>
                <p className='mb-3'>
                    <span className='fw-bold'>Description</span>: <br/>
                    {project.description}
                </p>
                <p className='mb-3'>
                    <span className='fw-bold'>Due Date</span>: <br/>
                    {project.due_date && project.due_date.substring(0, 10)}
                </p>
                <p className='mb-3'>
                    <span className='fw-bold'>Priority</span>: <br/>
                    {project.priority}
                </p>
                <p className='mb-3'>
                    <span className='fw-bold'>Status</span>: <br/>
                    {project.status}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default InfoModal;