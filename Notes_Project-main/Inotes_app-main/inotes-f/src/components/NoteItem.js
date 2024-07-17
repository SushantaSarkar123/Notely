import React, {useContext} from 'react'
import {Card, Col} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash , faPenToSquare} from '@fortawesome/free-solid-svg-icons'
import NoteContext from '../context/notes/NoteContext';
function NoteItem(props) {
  const {note, updateNote} = props;
    const context = useContext(NoteContext);
    const {deleteNote} = context;
    const onDelete=(id)=>{
        deleteNote(id)
      props.showAlert('Deleted Successfully','success')
    }
  return (
    <Col>
    <Card>
    <Card.Body>
      <Card.Title>{props.note.title}</Card.Title>
      <Card.Text>
      {props.note.description}
      </Card.Text>
      <button type="submit" className="btn btn-danger mx-3" onClick={()=>onDelete(note._id)}><FontAwesomeIcon icon={faTrash} /></button>
      <button type="submit" className="btn btn-primary mx-3" onClick={()=>updateNote(note)}><FontAwesomeIcon icon={faPenToSquare} /></button>
    </Card.Body>
  </Card>
  </Col>
  )
}

export default NoteItem
