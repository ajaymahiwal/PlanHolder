

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
    },
    list:[
        {
            type:String,
        }
    ],
    created_by:{
        type:String,
    },
    completed:{
        type:Boolean,
        default:false,
    },
    jobRef:{
        type:mongoose.Schema.Types.Mixed,
    }
});



const Task = new mongoose.model("task",taskSchema);

module.exports = {Task};