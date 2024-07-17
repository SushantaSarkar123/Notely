import React, { useContext, useState } from "react";
import NoteContext from "../context/notes/NoteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
function AddNote(props) {
  const context = useContext(NoteContext);
  const { addNote } = context;
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });
  const onChange = (event) => {
    setNote({ ...note, [event.target.name]: event.target.value });
  };
  const handleClick = (event) => {
    event.preventDefault();
    addNote(note.title, note.description, note.tag);
    props.showAlert('Added Successfully','success')
    setNote({
      title: "",
      description: "",
      tag: "",
    })
  };
  return (
    <>
      <h2>Add new iNote</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            onChange={onChange} value={note.title}
            id="title"
            name="title"
            type="text"
            className="form-control"
            required={true}
            minLength={5}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            onChange={onChange} value={note.description}
            id="description"
            name="description"
            type="text"
            className="form-control"
            required={true}
            minLength={5}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <select className="form-select" aria-label="tag" id='tag' name="tag" onChange={onChange} value={note.tag} required={true}>
            <option value="personal">personal</option>
            <option value="reminder">reminder</option>
            <option value="default">default</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success" onClick={handleClick} disabled={note.title.length<5 ||note.description.length<5}>
          Add <FontAwesomeIcon icon={faSquarePlus} />
        </button>
      </form>
    </>
  );
}

export default AddNote;
