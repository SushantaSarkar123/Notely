import React, { useContext, useEffect, useRef, useState } from 'react'
import NoteContext from '../context/notes/NoteContext';
import NoteItem from './NoteItem'
import AddNote from './AddNote';
import { Row } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
function Notes(props) {
    const context = useContext(NoteContext);
    const {notes, getAllNotes, editNote} = context;
    const [note, setNote]=useState({id:'', etitle:'', edescription : '', etag:''});
    const history = useNavigate()
    useEffect(()=>{
      if(localStorage.getItem('token')){
        getAllNotes();
      }
      else history('/login')
      // eslint-disable-next-line
    }, [note])
    const ref = useRef(null);
    const refClose = useRef(null);
    const updateNote=(currNote)=>{
      ref.current.click();
      setNote({id:currNote._id, etitle:currNote.title, edescription:currNote.description, etag:currNote.tag});
    }
    const onChange = (event) => {
      setNote({ ...note, [event.target.name]: event.target.value });
    };
    const handleClick = () => {
      editNote(note.id, note.etitle, note.edescription, note.etag);
      refClose.current.click()
      props.showAlert('Edited Successfully','success')
    };
  return (
    <>
    <AddNote showAlert={props.showAlert}/>
    <button type="button" className="btn d-none" data-bs-toggle="modal" data-bs-target="#exampleModal" ref={ref}>hidden</button>
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit iNote</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
        <div className="mb-3">
          <label htmlFor="etitle" className="form-label">
            Title
          </label>
          <input
            onChange={onChange} value={note.etitle}
            id="etitle"
            name="etitle"
            type="text"
            className="form-control"
            required={true}
            minLength={5}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="edescription" className="form-label">
            Description
          </label>
          <input
            onChange={onChange} value={note.edescription}
            id="edescription"
            name="edescription"
            type="text"
            className="form-control"
            required={true}
            minLength={5}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="etag" className="form-label">
            Tag
          </label>
          <select className="form-select" aria-label="etag" id='etag' name="etag" onChange={onChange} value={note.etag} required={true}>
            <option value="personal">personal</option>
            <option value="reminder">reminder</option>
            <option value="default">default</option>
          </select>
        </div>
      </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" ref={refClose} data-bs-dismiss="modal"><FontAwesomeIcon icon={faXmarkCircle} /></button>
            <button type="button" className="btn btn-success" onClick={()=>handleClick()}><FontAwesomeIcon icon={faFloppyDisk} /></button>
          </div>
        </div>
      </div>
    </div>
    <h2>iNotes</h2>
    <Row lg={4}>
      {notes.length===0 && 'NO iNOTES AVAILABLE'}
    {notes.map((noteElement)=>{
      return (<NoteItem note={noteElement} key={noteElement._id} updateNote={updateNote} showAlert={props.showAlert}/>)
    })}
    </Row>
    </>
  )
}

export default Notes
