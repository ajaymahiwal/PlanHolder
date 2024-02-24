

const express = require("express");
const router = express.Router({ mergeParams: true });
const { Task } = require("../models/Task");
const { User } = require("../models/User");
const wrapAsync = require("../middlewares/wrapAsync");


router.get("/data",wrapAsync(async (req, res) => {

    let { listName } = req.query;
    if(listName){
        listName = listName.toLowerCase();
    // console.log(q);
    // let idx = q.charAt(q.length - 1); //idx is now string 
    // let listIdx = parseInt(idx); //converted string into number
    // let listName = req.user.lists[listIdx];
    // console.log(listName)

    let data = await Task.find({ list: `${listName}`, created_by: `${req.user._id}` });
    // console.log(data);
    // console.log(JSON.stringify(data));
    res.json(JSON.stringify(data));

    /*
    res.json({
        name:"AjayMahiwal",
        name1:"AjayMahiwal",
    })
    */
    }else{
        req.flash("error","Something Went Wrong When You Are Requesting List.");
        res.redirect("/dashboard");
    }
    
}));

router.get("/search/data", async (req, res) => {
    let { q } = req.query;
    // console.log(q);
    // console.log(req.user);
    let data = req.user.lists.filter((l) => {
        return l.includes(q.toLowerCase());
    });
    // console.log(data);
    let d = await Task.find({ list: `${data[0]}`, created_by: `${req.user._id}` });
    d.push(data[0]); //searching list name
    console.log(d);
    res.json(JSON.stringify(d));

    // res.json(JSON.stringify({
    //     "name":"AJay"
    // }))
})



router.get("/new", async (req, res) => {
    let user = await User.findById(req.user._id).populate("tasks");
    let tasks = user.tasks;
    res.render("./task/createList", { tasks });
})
router.post("/new", async (req, res) => {
    let { list, listData } = req.body;

    if (req.user.lists.includes(list.name.toLowerCase())) {
        req.flash("error", `${list.name} List Name is Already exits, choose some other name.`)
        res.redirect("/lists/new");
    }
    else {
        console.log(list);
        console.log(listData);
        list.name = list.name.toLowerCase();
        let updatedUser = await User.findByIdAndUpdate(req.user._id, {
            lists: [...req.user.lists, list.name],
        }, { new: true, runValidators: true });

        for (let key in listData) {
            let t_id = listData[key];
            let task = await Task.findById(t_id);
            let t = await Task.findByIdAndUpdate(t_id, { list: [...task.list, list.name] })
        }
        res.redirect("/dashboard");
    }
})

router.get("/edit", async (req, res) => {
    console.log(req.query);
    let { listName } = req.query;
    if (listName) {
        if (!req.user.lists.includes(listName)) {
            req.flash("error", `Which list you want to edit,${listName} that does not exists.`);
            res.redirect("/dashboard");
        }
        else{
            console.log("listName:", listName);
        let listTasks = await Task.find({ list: listName, created_by: `${req.user._id}` });
        let taskListName = [];
        listTasks.forEach((el) => { // getting only the task name which have list name => listName
            taskListName.push(el.name);
        })
        console.log(taskListName);
        let user = await User.findById(req.user._id).populate("tasks");
        console.log(user._id);
        res.render("./task/editList", { taskListName, listName, user });
        }
    } else {
        req.flash("error", "List Name Is Not Vaild So, Please Try Again Later !!");
        res.redirect("/dashboard");
    }
    // res.redirect("/dashboard");
});

router.put("/edit/name", async (req, res) => {
    let { newListName, oldListName } = req.body;
    console.log(oldListName);
    console.log(newListName);
    oldListName = oldListName.toLowerCase();
    newListName = newListName.toLowerCase();

    if (req.user.lists.includes(newListName)) {
        req.flash("error", `${newListName} List Name is Already exits, choose some other name.`)
        res.redirect(`/lists/edit?listName=${oldListName}`);
    }
    else {
        let userLists = req.user.lists;
        userLists.splice(userLists.indexOf(oldListName), 1, newListName);//replace 
        await User.findByIdAndUpdate(req.user._id, { lists: [...userLists] });

        let tasksWithOldListName = await Task.find({ list: oldListName, created_by: `${req.user._id}` });
        if (tasksWithOldListName) {
            tasksWithOldListName.forEach(async (obj) => {
                let task = await Task.findById(obj._id);
                let newList = [...task.list];
                newList.splice(newList.indexOf(`${oldListName}`), 1, `${newListName}`);
                await Task.findByIdAndUpdate(obj._id, { list: [...newList] });
            });
        }
        res.redirect(`/lists/edit?listName=${newListName}`);
    }
});
router.put("/edit/tasks/new", async (req, res) => {

    let { taskData } = req.body;
    let { listName } = req.query;
    listName = listName.toLowerCase();



    if (taskData) {
        taskData.forEach(async (id) => {
            let task = await Task.findById(id);
            let newList = [...task.list];
            // if (newList.includes(listName)) {
            //     newList.splice(newList.indexOf(`${oldListName}`), 1, `${listName}`);
            // }
            // // else{
            // //     newList.
            // // }
            newList.push(listName);
            await Task.findByIdAndUpdate(id, { list: [...newList] });
        });
    }




    // let newList = [...req.user.lists];
    // if (!newList.includes(listName)) {
    //     newList.splice(newList.indexOf(`${oldListName}`), 1, `${listName}`);
    //     await User.findByIdAndUpdate(req.user._id, { lists: [...newList] });
    // }

    res.redirect(`/lists/edit?listName=${listName}`);
    // }

});
router.delete("/delete", async (req, res) => {
    console.log(req.query);
    let { listName } = req.query;

    let newList = req.user.lists.filter((l) => {
        return l != listName;
    });
    console.log(newList);
    let upUser = await User.findByIdAndUpdate(req.user._id, { lists: [...newList] });
    let listTasks = await Task.find({ list: listName, created_by: `${req.user._id}` });

    listTasks.forEach(async (element) => {
        let newL = element.list.filter((l) => {
            return l != listName;
        });
        await Task.findByIdAndUpdate(element._id, { list: [...newL] });
        console.log(await Task.findById(element._id));
    });

    console.log(upUser);
    res.redirect("/dashboard");
});

router.delete("/edit/:listName/tasks/:taskId", async (req, res) => {
    let { listName, taskId } = req.params;
    let task = await Task.findById(taskId);
    let newList = task.list.filter((el) => {
        return el != listName;
    });
    await Task.findByIdAndUpdate(taskId, { list: [...newList] });
    res.redirect(`/lists/edit?listName=${listName}`);
});


module.exports = router;