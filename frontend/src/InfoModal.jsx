import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { formatDigit, hourMinSecondsMilli } from '../util';
function InfoModal({project, show, setShow}) {
    const handleClose = () => {
        setShow(false);
    };

    const [time, setTime] = useState(0);
    useEffect(() => {
        if(show){
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTime(project.milliseconds)
        }
    }, [show])

    const {hour, min, sec, milliseconds} = hourMinSecondsMilli(time);
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header >
                <Modal.Title>{project.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className='mb-3'>{project.description}</p>
                <p>Total Time Spent: <span className="fw-bold">{formatDigit(hour)}:{formatDigit(min)}:{formatDigit(sec)}:{formatDigit(milliseconds).substring(0,2)}</span></p>
                <p className='text-muted'>(hour:min:seconds:milliseconds)</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default InfoModal;