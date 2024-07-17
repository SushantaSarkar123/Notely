const mongoose = require('mongoose');
const mongooseURI = 'mongodb+srv://nandkuliyar1:AqdpP2FWQI4oN2Gv@cluster0.wf8x6xi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectToMongoose = async () =>{
    await mongoose.connect(mongooseURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
}

module.exports = connectToMongoose;
