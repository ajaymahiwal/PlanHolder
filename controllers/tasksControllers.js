const { Task } = require("../models/Task");
const { User } = require("../models/User");
// const schedule = require("node-schedule");
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


function createJob(reminder) {

    const jobRef = cron.schedule(reminder.date, () => {
        console.log("reminder time arrived my dear, msg sending......");
        // callback will run after reminder scheduled time
        client.messages
            .create({
                body: `Hello ${reminder.owner.toUpperCase()}, this a reminder for your ${reminder.taskName.toUpperCase()} Task. Thank You For Using PlanHolder :)`,
                // body:"Hello bhaii ajay mein twilio se bol rha hu",
                from: '+15169814205',
                // to: `+${reminder.userContact}`,
                to:"+918168152757"
            })
            .then(message => console.log(message.sid))
            .catch(error => console.error(error));
        console.log("msg is sent now");

    },{
        // scheduled: true,
        timezone: "Asia/Kolkata"

    })
    // console.log("job",job);
    console.log("job is created !");

    return jobRef;
}


module.exports.index = async (req, res) => {
    console.log(req.user);
    // let u = req.user;
    let user = await User.findById(req.user._id).populate('tasks');
    res.render("./task/tasks.ejs", { user });
}

module.exports.getNewTaskPage = (req, res) => {
    res.render("./task/new.ejs");
}


module.exports.postNewTask = async (req, res) => {
    let { task, listData } = req.body;
    task.name = task.name.toLowerCase();
    console.log(task.d_date);
    console.log(task.d_time);
    task.deadline = task.d_date + "T" + task.d_time+":00.000Z";
    



    let isTaskNameUnique = await Task.findOne({ name: `${task.name}`, created_by: `${req.user._id}` });
    //ager us naam ka task huaa us user k pass to isTaskNameUnique mein vo task object aa jayega
    if (isTaskNameUnique) {
        //yani jab vo already us naam ka task us user k pass hai tab
        req.flash("error", `You have already a task with ${task.name} name ! So please choose some other name for task :)`);
        res.redirect("/tasks/new");
    }
    else {
        let phone_no = req.user.contact_num ? req.user.contact_num : null;

        let hr = task.d_time.substring(0, 2);   //e.g. 16:36
        let min = task.d_time.substring(3);

        let month = task.d_date.substring(5, 7); //e.g 2024-02-27
        let date = task.d_date.substring(8);

        let reminderTime = "" + min + " " + hr + " " + date + " " + month + " *";
        console.log(reminderTime);
        let indianCurrentTime = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
        console.log(indianCurrentTime);
        console.log(task.deadline);
        console.log(Date.parse(task.deadline));
        console.log("Date.parse result", Date.parse(task.deadline) > Date.parse(indianCurrentTime));


        if ((Date.parse(indianCurrentTime) < Date.parse(task.deadline)) && phone_no) {
            let taskRef = createJob({
                date: reminderTime,
                owner: req.user.name,
                taskName: task.name,
                userContact: phone_no,
            });

            // task.jobRef = JSON.stringify(taskRef);
            // console.log("TaskRef", task.jobRef);
            // console.log("TaskRef", taskRef);
        }
        else {
            task.jobRef = null;
        }

        if (!listData) {
            listData = [];
        }
        task.list = listData;
        task.created_by = req.user._id;
        task.created_at = Date.now();
        // ye time hai indian but ye isse GMT smaj rhe hai isliye -5:30 ker duga
        task.deadline = Date.parse(task.deadline) - (5.5 * 60 * 60 * 1000);
        task.deadline = new Date(task.deadline);
        
        // new Date(Date.now()).toLocaleString(undefined,{timezone:"Asia/Kolkata"})
        console.log(task.created_at)
        let newtask = new Task({ ...task });
        await newtask.save();

        await User.findByIdAndUpdate(req.user._id, {
            tasks: [...req.user.tasks, newtask._id],
        }, { new: true, runValidators: true });

        //    {
        //      // let newList = [];
        //     // for (let i = 0; i < listData.length; i++) {
        //     //     if (!req.user.lists.includes(listData[i])) {
        //     //         newList.push(listData[i]);
        //     //     }
        //     // }
        //     // let upuser = await User.findByIdAndUpdate(req.user._id, {
        //     //     lists: [...req.user.lists, ...newList],
        //     // }, { new: true, runValidators: true });
        //     // console.log(upuser);
        //    }

        res.redirect(`/tasks/${newtask._id}`);
    }
    // res.redirect(`/tasks/new`);

}


module.exports.getTask = async (req, res) => {
    let id = req.params.id;

    let task = await Task.findById(id);
    if (task) {
        res.render("./task/showtask", { task });
    }else {
        throw new Error("Task Not found");
    }
}

module.exports.getEditTaskPage = async (req, res) => {
    let id = req.params.id;
    let task = await Task.findById(id);
    if (task) {
        res.render("./task/edit", { task });
    }else {
        throw new Error("Task Not found");
    }
}


module.exports.editTask = async (req, res) => {
    let id = req.params.id;
    let { task, listData, isTaskNameChanged } = req.body;

    console.log(task);
    console.log(listData);



    let isTaskNameUnique = false;
    if (!isTaskNameChanged) {// task name changed hai to check ker rhe hai already exist or not
        task.name = task.name.toLowerCase();
        isTaskNameUnique = await Task.findOne({ name: `${task.name}`, created_by: `${req.user._id}` });
    }//ager taskName changed nhi hai yani same hai to hme ye nhi khna hai ki task k liye koi dusra naam rakho, ho skta hai user sirf date ya description change kerna chata ho

    if (isTaskNameUnique) {
        //yani jab vo already us naam ka task us user k pass hai tab
        req.flash("error", `You have already a task with ${task.name} name ! So please choose some other name for task :)`);
        res.redirect(`/tasks/${id}/edit`);
    }
    else {
        let oldSavedTask = await Task.findById(id);
        // let newL = [...oldSavedTask.list];

        console.log(task.d_date);
        console.log(task.d_time);
        task.deadline = task.d_date + "T" + task.d_time+":00.000Z"; 

        let indianCurrentTime = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
        console.log("Date.parse result", Date.parse(task.deadline) > Date.parse(indianCurrentTime));



        if ((task.deadline != oldSavedTask.deadline) && (Date.parse(indianCurrentTime) < Date.parse(task.deadline))) {

            if (oldSavedTask.jobRef) {
                oldSavedTask.jobRef.stop();
            }
            //for cancel it will return true or false

            let phone_no = req.user.contact_num ? req.user.contact_num : null;

            let hr = task.d_time.substring(0, 2);   //e.g. 16:36
            let min = task.d_time.substring(3);

            let month = task.d_date.substring(5, 7);
            let date = task.d_date.substring(8);

            let reminderTime = "" + min + " " + hr + " " + date + " " + month + " *";

            //ager phone number nhi to schedule kene ka kyafayda isliye
            if (phone_no) { //phone number hai to schedule hai
                let taskRef = createJob({
                    date: reminderTime,
                    owner: req.user.name,
                    taskName: oldSavedTask.name,
                    userContact: phone_no,
                });

                // task.jobRef = taskRef;
                // console.log("taskRef", taskRef);
            }
        }


        if (!listData) {
            listData = [];
        }
        // ye time hai indian but ye isse GMT smaj rhe hai isliye -5:30 ker duga
        task.deadline = Date.parse(task.deadline) - (5.5 * 60 * 60 * 1000);
        task.deadline = new Date(task.deadline);
        let newTask = await Task.findByIdAndUpdate(id, { ...task, list: [...listData] }, { new: true, runValidators: true });
        await newTask.save();
        console.log("Updated Task", newTask);

        res.redirect(`/tasks/${id}`);
    }
}



module.exports.deleteTask = async (req, res) => {
    let id = req.params.id;
    let delTask = await Task.findByIdAndDelete(id);
    console.log("task deleted", delTask);
    let newTask = req.user.tasks.filter((t) => t != id)
    await User.findByIdAndUpdate(req.user._id, { tasks: [...newTask] });
    req.flash("success", `${delTask.name.toUpperCase()} Task Is Deleted Successfully !`);
    res.redirect("/tasks");
}


module.exports.editTaskCompleted = async (req, res) => {
    let { id } = req.params;
    let task = await Task.findById(id);
    task.completed = !task.completed;
    let up = await Task.findByIdAndUpdate(id, { ...task }, { new: true, runValidators: true });
    console.log(up);

    res.redirect(`/tasks/${id}`);
}