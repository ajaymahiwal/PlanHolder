
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Task } = require("./Task");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'task'
        }
    ],
    lists: [
        {
            type: String,
        },
    ],
    image: {
        type: String,
        default:
            "https://img.freepik.com/free-vector/cute-happy-smiling-child-isolated-white_1308-32243.jpg",
        set: (v) =>
            v === ""
                ? "https://img.freepik.com/free-vector/cute-happy-smiling-child-isolated-white_1308-32243.jpg"
                : v,
    },
    dob:{
        type:Date,
    },
    gender:{
        type:String,
    },
    contact_num:{
        type:String,
    },
    bio:{
        type:String,
    },
    google_id:{
        type:String,
    }
});

userSchema.post("findOneAndDelete", async (user) => {
    if (user.tasks.length) {
        let data = await Task.deleteMany({ _id: { $in: user.tasks } });
        console.log("Data Information about tasks deleted of user", data);
    }
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);



module.exports = { User };