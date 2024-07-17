import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = 'http://localhost:5000';
    const [notes, setNotes] = useState([]);

    const getAllNotes = async()=>{
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token'),
        }
      });
      const json = await response.json();
      setNotes(json)
    }


    const addNote = async (title, description, tag) =>{
      const response = await fetch(`${host}/api/notes/createnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token'),
        },
        body: JSON.stringify({title, description, tag})
      });
      const json = await response.json()
      setNotes(notes.concat(json));
    }
    const deleteNote = async(id) =>{
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token'),
        }
      });
      const json = await response.json();
      setNotes(json)
      const newNotes = notes.filter(note => {return note._id !== id})
      setNotes(newNotes)
    }
    const editNote = async (id, title, description, tag) =>{
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token'),
        },
        body: JSON.stringify({title, description, tag})
      });
      const json = await response.json();
      console.log(json)
      let editNotes = JSON.parse(JSON.stringify(notes))
      for(let index=0; index<editNotes.length; index++){
        let e = editNotes[index];
        if(e._id === id){
          editNotes[index].tag = tag;
          editNotes[index].title = title;
          editNotes[index].description = description;
          break;
        }
      }
      setNotes(editNotes)
    }
    return (
        <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getAllNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;