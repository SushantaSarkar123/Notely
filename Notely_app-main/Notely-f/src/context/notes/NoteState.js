import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
  const [allNotes, setAllNotes] = useState(notesInitial);

  const getAllNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      }
    });
    const json = await response.json();
    setNotes(json);
    setAllNotes(json);
  }

  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/createnote`, { // Updated endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });

    const note = await response.json();
    setNotes(notes.concat(note));
    setAllNotes(allNotes.concat(note));
  }

  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      }
    });
    const json = await response.json();
    const newNotes = allNotes.filter((note) => { return note._id !== id });
    setNotes(newNotes);
    setAllNotes(newNotes);
  }

  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });
    const json = await response.json();

    let newNotes = JSON.parse(JSON.stringify(allNotes));
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
    setAllNotes(newNotes);
  }

  const searchNotes = (searchTerm) => {
    const filteredNotes = allNotes.filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setNotes(filteredNotes);
  }

  return (
    <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getAllNotes, searchNotes}}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;