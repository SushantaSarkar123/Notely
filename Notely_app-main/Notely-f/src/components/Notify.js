import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, ListGroup, Badge } from 'react-bootstrap';
import { ReminderContext } from '../context/reminders/ReminderContext';
import Alert from './Alert';
import CustomModal from './PopUpConfirm'; // Import the custom modal
import './Notify.css'; // Import the CSS file for animations
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const Notify = () => {
    const { reminders = [], alert, fetchReminders, addReminder, updateReminder, deleteReminder, showAlert } = useContext(ReminderContext);
    const [task, setTask] = useState({ title: '', deadline: '' });
    const [currentTask, setCurrentTask] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [taskToDelete, setTaskToDelete] = useState(null); // Store the task to delete
    const [showAddTask, setShowAddTask] = useState(false); // State to toggle add task section
    const ref = useRef(null);
    const [searchTerm, setSearchTerm] = useState(''); // Local search term state

    useEffect(() => {
        fetchReminders();
    }, []);

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedDeadline = new Date(task.deadline);
        const currentTime = new Date();

        // Check if the selected deadline is in the past
        if (selectedDeadline <= currentTime) {
            showAlert("The deadline must be a future time.", "danger");
            return;
        }

        if (task.title.trim() && task.deadline) {
            try {
                await addReminder(task);
                setTask({ title: '', deadline: '' });  // Reset the form after success
            } catch (error) {
                showAlert("Failed to add reminder. Please try again.", "danger");
            }
        } else {
            showAlert("Title and deadline are required", "danger");
        }
    };

    const updateTask = (taskToEdit) => {
        setCurrentTask(taskToEdit);
        // Format the deadline to match the datetime-local input format
        const formattedDeadline = new Date(taskToEdit.deadline).toISOString().slice(0, 16);
        setTask({ title: taskToEdit.title, deadline: formattedDeadline }); // Pre-fill the form with current task details
        ref.current.click();
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (currentTask) {
            await updateReminder(currentTask._id, task);
            setTask({ title: '', deadline: '' }); // Clear input fields
            setCurrentTask(null);
            setShowModal(false); // Close the modal after update
            document.querySelector(".btn-close").click(); // Programmatically close the Bootstrap modal
            ref.current.setAttribute('data-bs-dismiss', 'modal'); // Set the modal to close attribute
            ref.current.click(); // Trigger the modal close
        }
    };

    const handleShowModal = (id) => {
        setTaskToDelete(id); // Set the task ID to delete
        setShowModal(true); // Show the modal
    };

    const handleDelete = async () => {
        if (taskToDelete) {
            await deleteReminder(taskToDelete); // Call the delete function
            setShowModal(false); // Close the modal
            setTaskToDelete(null); // Reset the task to delete
        }
    };

    // Filter reminders based on the search term
    const filteredReminders = reminders.filter(reminder => 
        reminder.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to determine if the deadline is approaching or overdue
    const isDeadlineApproaching = (deadline) => {
        const now = new Date();
        const taskDeadline = new Date(deadline);
        const timeDiff = taskDeadline - now;

        return timeDiff > 0 && timeDiff <= 30 * 60 * 1000; // Within the next 30 minutes
    };

    const isOverdue = (deadline) => {
        const now = new Date();
        return new Date(deadline) < now; // Task is overdue
    };

    return (
        <div style={{ paddingTop: '70px' }}> {/* Space for the navbar */}
            <div className="container mt-4">
                <h1>Reminders</h1>
                <Alert alert={alert} />

                {/* Toggle Button for Add Task Section */}
                <Button 
                    onClick={() => setShowAddTask(!showAddTask)} 
                    variant={showAddTask ? "secondary" : "primary"}
                    className="my-3"
                >
                    <FontAwesomeIcon icon={showAddTask ? faMinus : faPlus} />
                    {showAddTask ? " Hide Add Task" : " Add Task"}
                </Button>

                {/* Conditionally Render Add Task Form */}
                {showAddTask && (
                    <Form onSubmit={handleSubmit} className="mb-3">
                        <Form.Group controlId="formTaskTitle">
                            <Form.Label>Task Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="Enter task title"
                                value={task.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formTaskDeadline">
                            <Form.Label>Deadline</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="deadline"
                                value={task.deadline}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-2">
                            Add Task
                        </Button>
                    </Form>
                )}

                <ListGroup>
                    {filteredReminders.length > 0 ? (
                        filteredReminders.map((task) => (
                            <ListGroup.Item 
                                id={task._id} 
                                key={task._id} 
                                className="d-flex justify-content-between align-items-center flex-column flex-md-row"
                            >
                                <div className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{task.title} - {new Date(task.deadline).toLocaleString()}</span>
                                        <div>
                                            {isOverdue(task.deadline) && (
                                                <Badge pill bg="danger" className="ms-2">Overdue</Badge>
                                            )}
                                            {isDeadlineApproaching(task.deadline) && (
                                                <Badge pill bg="warning" className="ms-2">Deadline Approaching</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 mt-md-0 d-flex">
                                    <Button variant="warning" onClick={() => updateTask(task)} className="me-2 btn-sm">Edit</Button>
                                    <Button variant="success" onClick={() => handleShowModal(task._id)} className="btn-sm">Complete</Button>
                                </div>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item>No tasks available</ListGroup.Item>
                    )}
                </ListGroup>

                {/* Custom Confirmation Modal */}
                <CustomModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    handleConfirm={handleDelete}
                    message="Are you sure you want to delete this reminder?"
                />

                {/* Modal for Editing Task */}
                <button
                    type="button"
                    className="btn d-none"
                    data-bs-toggle="modal"
                    data-bs-target="#editTaskModal"
                    ref={ref}
                >
                    hidden
                </button>
                <div
                    className="modal fade"
                    id="editTaskModal"
                    tabIndex="-1"
                    aria-labelledby="editTaskModalLabel"
                    aria-hidden="true"
                    backdrop="static" // Prevent closing on outside click
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editTaskModalLabel">
                                    Edit Task
                                </h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <Form onSubmit={handleEditSubmit}>
                                    <Form.Group controlId="editTaskTitle">
                                        <Form.Label>Task Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            placeholder="Enter task title"
                                            value={task.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="editTaskDeadline">
                                        <Form.Label>Deadline</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            name="deadline"
                                            value={task.deadline}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="success" type="submit" className="mt-2">
                                        Update Task
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notify;
