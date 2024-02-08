

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    description:{
        type: String,
    },
    created_at:{
        type:Date,
        default: Date.now(),
    },
    deadline:{
        type:Date,
    }
});



const Task = new mongoose.model("task",taskSchema);

module.exports = {Task};