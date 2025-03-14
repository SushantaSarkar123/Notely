import React, { useContext, useState } from "react";
import NoteContext from "../context/notes/NoteContext";
import { Form, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function AddNote(props) {
  const context = useContext(NoteContext);
  const { addNote } = context;
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "default",
  });

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "default" });
    props.showAlert("Note added successfully", "success");
  };

  // Check if the title and description meet the requirements
  const isTitleValid = note.title.length >= 3;
  const isDescriptionValid = note.description.length >= 5;

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title>Add a New Note</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter title" 
              name="title"
              value={note.title}
              onChange={onChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Enter description"
              name="description"
              value={note.description}
              onChange={onChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tag</Form.Label>
            <Form.Select
              name="tag"
              value={note.tag}
              onChange={onChange}
            >
              <option value="default">Default</option>
              <option value="personal">Personal</option>
              <option value="reminder">Reminder</option>
            </Form.Select>
          </Form.Group>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={!isTitleValid || !isDescriptionValid} // Disable button if validation fails
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Note
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AddNote;
