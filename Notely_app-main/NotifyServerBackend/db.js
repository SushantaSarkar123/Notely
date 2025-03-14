const mongoose = require('mongoose');

require('dotenv').config();

const mongooseURI = process.env.MONGO_URI; // Ensure you specify the database name

const connectToMongoose = async () => {
    try {
        await mongoose.connect(mongooseURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        });
        console.log("Connected to MongoDB Successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

module.exports = connectToMongoose;

