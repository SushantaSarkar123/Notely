const express = require('express');  // for server
const nodemailer = require('nodemailer'); // for automated mail
const cron = require('node-cron');  // for sheduling a task after a perticular time
const cors = require('cors');  // for frontend talk with backend without thirt party access // Cross-Origin Resource Sharing (CORS)
const connectToMongoose = require('./db'); // Import the connection function of mongoDB
const User = require('./models/Users'); // import the modules for useing it to fetch data from database
const Remainders = require('./models/Remainders'); // import the modules for useing it to fetch data from database
// require('dotenv').config();

const app = express();  // set up the server
const port = process.env.PORT1 || 5001; // Use a different port for the notification server for no problem with frontend

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToMongoose();

// Nodemailer configuration for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the email service
  auth: {
    user: 'freephotoprovidor@gmail.com', // Your Gmail address
    pass: 'laqlybvimmlofmsk', // Your app password
  },
});

// Object to track the last time an email was sent with last sent time and user id
const lastSent = {};

// Format date to IST and 12-hour format for logging
const formatDateToIST = (date) => {
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
};

// Function to check reminders and send email if necessary
const checkReminders = async () => {
  try {
    const now = new Date();
    console.log(`Scanning for reminders... at ${formatDateToIST(now)}`);
    
    // Fetch reminders due in the next 15 minutes using Mongoose
    const remindersWithDeadlines = await Remainders.find({
      deadline: { $gt: now, $lt: new Date(now.getTime() + 15 * 60 * 1000) },  // $gt means greter than and $lt less than
      completed: false   // for fetching only incomplete task
    }).populate('user'); // Populate user details add email and other stufs which will be neded later for sending notifications

    // Log results // debugging purpose
    console.log("Fetched data:", JSON.stringify(remindersWithDeadlines, null, 2));

    if (remindersWithDeadlines.length === 0) {
      console.log("No deadlines to mail.");
      return;
    }

    // Iterate through reminders and send emails
    for (const reminder of remindersWithDeadlines) {
      const user = reminder.user; // User details populated from the reminder

      if (!user) {
        console.error(`User not found for ID: ${reminder.user}`);
        continue;
      }

      const reminderId = reminder._id.toString();
      const lastSentTime = lastSent[user._id]?.[reminderId];  // ? returns undefined if the data is not present instade of crashing the server or code
      if (!lastSentTime || (now - lastSentTime) > 5 * 60 * 1000) { // Check if last sent time is more than 5 minutes ago   5 * 60 * 1000  -> 1 * 60 * 1000 for 1 min back
        const mailOptions = {
          from: 'freephotoprovidor@gmail.com', // Your Gmail address
          to: user.email, // Use the populated user email
          subject: 'Reminder: Incomplete Task',
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0,0,0,0.1); border: 1px solid #e0e0e0;">
                <h2 style="color: #4A90E2; font-size: 24px; margin-bottom: 10px;">🔔 Reminder: Incomplete Task</h2>
                
                <p style="color: #555;">Dear User,</p>
                
                <p style="color: #555; font-size: 16px;">You have an incomplete task that requires your attention:</p>
                
                <ul style="list-style: none; padding: 0; color: #333;">
                    <li><strong style="color: #333;">Task Title:</strong> ${reminder.title}</li>
                    <li><strong style="color: #333;">Due Date:</strong> ${formatDateToIST(reminder.deadline)}</li>
                </ul>
                
                <p style="color: #555; font-size: 16px;">Please make sure to complete it by the due date.</p>
                
                <p style="color: #555; font-size: 16px;">Thank you!</p>
                
                <p style="color: #888; font-size: 14px; margin-top: 20px; text-align: right;">Best regards,<br><em>Team Notely</em></p>
            </div>
          `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${user.email} for task: ${reminder.title}`);
        } catch (error) {
          console.error(`Failed to send email to ${user.email}: ${error.message}`);
        }

        lastSent[user._id] = { ...lastSent[user._id], [reminderId]: now };
      }
    }

    console.log(`Scanning done at ${formatDateToIST(new Date())}`);
  } catch (error) {
    console.error("Error checking reminders:", error.message);
  }
};

// Schedule the task to run every 5 minutes // /5 -> /1 for 1 min interval
cron.schedule('*/5 * * * *', () => {
  console.log("Cron job triggered.");
  checkReminders();
});

app.listen(port, () => {
  console.log(`Notification server is running on port ${port}`);
});
