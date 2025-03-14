import React, { useContext, useState } from 'react'
import NoteContext from "../context/notes/NoteContext"
import { Card, Button, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare, faClock, faTag } from "@fortawesome/free-solid-svg-icons";

const NoteModal = ({ show, handleClose, note }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{note.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{note.description}</p>
                <div className="d-flex justify-content-between text-muted">
                    <span>
                        <FontAwesomeIcon icon={faTag} className="me-2" />
                        {note.tag}
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        {formatDate(note.date)}
                    </span>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const Noteitem = (props) => {
    const context = useContext(NoteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <div className="col-md-3">
            <Card className="my-3 p-2" onClick={handleShowModal} style={{ cursor: 'pointer' }}>
                <Card.Body className="d-flex flex-column" style={{ height: '160px' }}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-${note._id}-title`}>{note.title}</Tooltip>}
                        >
                            <Card.Title className="mb-0 text-truncate" style={{maxWidth: '70%'}}>{truncateText(note.title, 20)}</Card.Title>
                        </OverlayTrigger>
                        <div onClick={(e) => e.stopPropagation()}>
                            <Button 
                                variant="danger" 
                                size="sm" 
                                className="me-1" 
                                onClick={(e) => { 
                                    e.stopPropagation();
                                    deleteNote(note._id); 
                                    props.showAlert("Deleted successfully", "success"); 
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} size="xs" />
                            </Button>
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={(e) => { 
                                    e.stopPropagation();
                                    updateNote(note);
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} size="xs" />
                            </Button>
                        </div>
                    </div>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-${note._id}-description`}>{note.description}</Tooltip>}
                    >
                        <Card.Text className="mb-2">{truncateText(note.description, 50)}</Card.Text>
                    </OverlayTrigger>
                    <div className="mt-auto d-flex justify-content-between align-items-center text-muted small">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-${note._id}-tag`}>{note.tag}</Tooltip>}
                        >
                            <span>
                                <FontAwesomeIcon icon={faTag} className="me-1" size="xs" />
                                {truncateText(note.tag, 15)}
                            </span>
                        </OverlayTrigger>
                        <span>
                            <FontAwesomeIcon icon={faClock} className="me-1" size="xs" />
                            {formatDate(note.date)}
                        </span>
                    </div>
                </Card.Body>
            </Card>
            <NoteModal show={showModal} handleClose={handleCloseModal} note={note} />
        </div>
    )
}

export default Noteitem
