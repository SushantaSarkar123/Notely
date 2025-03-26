const mongoose = require("mongoose");

const mongooseURI = process.env.MONGO_URI;


const connectToMongoose = async () => {
  await mongoose
    .connect(mongooseURI)
    .then(() => console.log("Connected to Mongo Successfully"))
    .catch((err) => console.log(err));
};

module.exports = connectToMongoose;














































// const mongoose = require('mongoose');
// const mongooseURI = 'mongoose://localhost:27017';
// const connectToMongoose = async ()=>{
//     await mongoose.connect(mongooseURI).then(()=>{
//         console.log("Connect to mongoose Succesfully").catch(err => console.log(err));

//     })
// }
// module.exports = connectToMongoose;

// const mongoose = require('mongoose');

// const mongooseURI = 'mongodb://localhost:27017/test'; // Ensure you specify the database name

// const connectToMongoose = async () => {
//     try {
//         await mongoose.connect(mongooseURI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
//         });
//         console.log("Connected to MongoDB Successfully");
//     } catch (err) {
//         console.error("MongoDB connection error:", err);
//     }
// };

// module.exports = connectToMongoose;
