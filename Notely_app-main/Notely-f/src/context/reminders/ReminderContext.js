// Inotes_app-main/inotes-f/src/context/reminders/ReminderContext.js
import React, { createContext, useState } from 'react';
import axios from 'axios';

const ReminderContext = createContext();

const ReminderProvider = ({ children }) => {
    const [reminders, setReminders] = useState([]);
    const [alert, setAlert] = useState(null);
    const [allReminders, setAllReminders] = useState([]); // Store all reminders for searching

    const showAlert = (message, type) => {
        setAlert({ msg: message, type: type });
        setTimeout(() => {
            setAlert(null);
        }, 3000);
    };

    const fetchReminders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showAlert("No token found. Please login again.", "danger");
                return;
            }
            const response = await axios.get('http://localhost:5000/api/remainders/fetchallremainders', {
                headers: {
                    'auth-token': token,
                },
            });
            setReminders(response.data);
            setAllReminders(response.data); // Store all reminders for searching
        } catch (error) {
            console.error("Fetch Reminders Error: ", error.response ? error.response.data : error.message);
            showAlert(`Error fetching reminders: ${error.response ? error.response.data.error : error.message}`, "danger");
        }
    };

    const addReminder = async (task) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showAlert("User not authenticated. Please log in.", "danger");
                return;
            }
            const response = await axios.post('http://localhost:5000/api/remainders/createremainder', task, {
                headers: {
                    'auth-token': token,
                },
            });
            setReminders((prev) => [...prev, response.data]);
            setAllReminders((prev) => [...prev, response.data]); // Update all reminders
            showAlert("Reminder added successfully!", "success");
        } catch (error) {
            console.error("Error adding reminder:", error.response ? error.response.data : error.message);
            showAlert(`Error adding reminder: ${error.response ? error.response.data.error : error.message}`, "danger");
        }
    };

    const updateReminder = async (id, updatedTask) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/api/remainders/updateremainder/${id}`, updatedTask, {
                headers: {
                    'auth-token': token,
                },
            });
            setReminders((prev) => prev.map(reminder => reminder._id === id ? response.data : reminder));
            setAllReminders((prev) => prev.map(reminder => reminder._id === id ? response.data : reminder)); // Update all reminders
            showAlert("Reminder updated successfully!", "success");
        } catch (error) {
            console.error("Error updating reminder:", error.response ? error.response.data : error.message);
            showAlert(`Error updating reminder: ${error.response ? error.response.data.error : error.message}`, "danger");
        }
    };

    const deleteReminder = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/remainders/deleteremainder/${id}`, {
                headers: {
                    'auth-token': token,
                },
            });
            setReminders((prev) => prev.filter(reminder => reminder._id !== id)); // Update state
            setAllReminders((prev) => prev.filter(reminder => reminder._id !== id)); // Update all reminders
            showAlert("Reminder deleted successfully!", "success");
        } catch (error) {
            console.error("Error deleting reminder:", error.response ? error.response.data : error.message);
            showAlert(`Error deleting reminder: ${error.response ? error.response.data.error : error.message}`, "danger");
        }
    };

    // Updated searchNotes function to include deadline comparison
    const searchNotes = (term) => {
        if (term.trim() === '') {
            setReminders(allReminders); // Reset to all reminders if search term is empty
        } else {
            const filtered = allReminders.filter(reminder =>
                reminder.title.toLowerCase().includes(term.toLowerCase()) ||
                new Date(reminder.deadline).toLocaleString().toLowerCase().includes(term.toLowerCase()) // Compare with deadline
            );
            setReminders(filtered); // Update reminders to only those that match the search term
        }
    };

    return (
        <ReminderContext.Provider value={{ reminders, alert, fetchReminders, addReminder, updateReminder, deleteReminder, showAlert, searchNotes }}>
            {children}
        </ReminderContext.Provider>
    );
};

export { ReminderContext, ReminderProvider };
