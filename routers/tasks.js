
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../middlewares/wrapAsync");
const {isTaskOwner} = require("../middlewares/isOwner");

const tasksControllers = require("../controllers/tasksControllers");



//Task -  CRUD operations
router.get("/", wrapAsync(tasksControllers.index));

router.get("/new",tasksControllers.getNewTaskPage);

router.post("/new", wrapAsync(tasksControllers.postNewTask));

router.get("/:id",isTaskOwner,wrapAsync(tasksControllers.getTask));

router.get("/:id/edit",isTaskOwner,wrapAsync(tasksControllers.getEditTaskPage));

router.put("/:id",isTaskOwner,wrapAsync(tasksControllers.editTask));

router.put("/:id/completed",isTaskOwner,wrapAsync(tasksControllers.editTaskCompleted));

router.delete("/:id",isTaskOwner,wrapAsync(tasksControllers.deleteTask));




module.exports = router;