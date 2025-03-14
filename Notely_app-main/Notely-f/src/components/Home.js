import React, { useState } from "react";
import Notes from "./Notes";
import AddNote from "./AddNote";
import Alert from "./Alert";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

function Home(props) {
  const [showAddNote, setShowAddNote] = useState(false);

  const toggleAddNote = () => {
    setShowAddNote(!showAddNote);
  };

  return (
    <>
      <div className="content-area">
        <Alert alert={props.alert} />
        <div style={{ paddingTop: '10px', paddingBottom: '20px' }}>
          <Button 
            onClick={toggleAddNote} 
            variant={showAddNote ? "secondary" : "primary"}
            className="my-3"
          >
            <FontAwesomeIcon icon={showAddNote ? faMinus : faPlus} />
            {showAddNote ? " Hide Add Note" : " Add Note"}
          </Button>

          {showAddNote && <AddNote showAlert={props.showAlert} />}
          <Notes showAlert={props.showAlert} />
        </div>
      </div>
    </>
  );
}

export default Home;
