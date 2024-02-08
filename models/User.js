
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
    },
    tasks:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'task'
        }
    ]
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User",userSchema);



module.exports = {User};