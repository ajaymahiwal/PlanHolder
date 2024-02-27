



const express = require("express");
const router = express.Router({ mergeParams: true });
const { Task } = require("../models/Task");
const { User } = require("../models/User");
const wrapAsync = require("../middlewares/wrapAsync");
const { parse } = require("dotenv");
const { isOwner } = require("../middlewares/isOwner")



router.get("/profile/:id", async (req, res) => {
    let allTask, completedTask, uncompletedTask, upcomingTask;
    if (req.user.tasks && req.user.tasks.length) {
        allTask = await Task.find({ created_by: `${req.user._id}` });

        completedTask = await Task.find({ completed: true, created_by: `${req.user._id}` });

        uncompletedTask = await Task.find({ completed: false, created_by: `${req.user._id}` });

        upcomingTask = allTask.filter((task) => {
            // console.log(task.deadline);
            let date = task.deadline.toISOString();
            let dateArr = date.split("-");
            let y = parseInt(dateArr[0]),
                mIdx = parseInt(dateArr[1]) - 1; //month ko index bna diya
            dateArr = dateArr[2].split("T");
            let d = parseInt(dateArr[0]);
            dateArr = dateArr[1].split(":");
            let h = parseInt(dateArr[0]), m = parseInt(dateArr[1]);

            // console.log(Date.now(),Date.UTC(y, mIdx, d, h, m,0));
            // console.log(Date.now() <= Date.UTC(y, mIdx, d, h, m,0));
            //  console.log(parseInt(Date.now()) <= parseInt(Date.UTC(y, mIdx, d, h, m,0)))
            return (parseInt(Date.now()) <= parseInt(Date.UTC(y, mIdx, d, h, m, 0)));
        });
    }
    // console.log(completedTask);
    res.render("./user/profile.ejs", { allTask, completedTask, uncompletedTask, upcomingTask });
});


router.get("/profile/:id/edit", async (req, res) => {
    res.render("./user/editProfile.ejs");
});
router.put("/profile/:id/edit", isOwner, async (req, res) => {
    let { user } = req.body;
    delete user.username; //it someone added i will not allow to change anybody
    // user.name = user.name.toLowerCase(); //user have full choice to  decide name
    let phone_no = user.contact_num;
    if (phone_no.length < 10 || phone_no.length > 13) { //e.g. +91 81681-52757
        phone_no = null;
        req.flash("error","Please Enter Vaild Phone Number :)");
        res.redirect(`/user/profile/${req.user._id}/edit`);
    } else {
        if (phone_no.length == 10) {
            phone_no = "91" + phone_no;
        }

        user.contact_num = phone_no;
        let updatedUser = await User.findByIdAndUpdate(`${req.user._id}`, { ...user }, { new: true, runValidators: true });
        console.log(updatedUser);
        // let updatedUser = await User.findById(`${req.user._id}`);
        res.redirect(`/user/profile/${req.user._id}/edit`);
    }
});




// router.get("/:id/delete/account",isOwner, async (req, res) => {
//     let { id } = req.params;
//     let delUser = await User.findByIdAndDelete(id);
//     console.log(delUser);
//     res.redirect("/");
// });

module.exports = router;