import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";

function InfoModal({project, show, setShow}) {
    const handleClose = () => {
        setShow(false);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header >
                <Modal.Title>{project.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{project.description}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default InfoModal;