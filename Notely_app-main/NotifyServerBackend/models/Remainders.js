const mongoose = require("mongoose");
const { Schema } = mongoose;

const RemaindersSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model('Remainders', RemaindersSchema);

// const mongoose = require('mongoose');

//    const RemainderSchema = new mongoose.Schema({
//        title: {
//            type: String,
//            required: true,
//        },
//        deadline: {
//            type: Date,
//            required: true,
//        },
//        user: {
//            type: mongoose.Schema.Types.ObjectId,
//            ref: 'User',
//            required: true,
//        },
//    });

//    module.exports = mongoose.model('Remainders', RemainderSchema);
