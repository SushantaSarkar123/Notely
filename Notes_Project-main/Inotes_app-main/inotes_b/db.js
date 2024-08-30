const mongoose = require('mongoose');
const mongooseURI = 'mongodb+srv://<db_username>:<db_password>@<cluster-address>/test?retryWrites=true&w=majority';

const connectToMongoose = async () =>{
    await mongoose.connect(mongooseURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
}

module.exports = connectToMongoose;
