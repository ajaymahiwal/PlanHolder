
require('dotenv').config()

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
// const cron = require("node-cron");



// let name = "AjayRaj";




// function scheduleReminder(reminder) {
//     const taskReminder = cron.schedule(reminder.scheduledTime, () => {
//         // callback will run after reminder scheduled time
//         // client.messages
//         //     .create({
//         //         body: `Hello ${reminder.owner}, this a reminder for your ${reminder.taskName.toUpperCase()} Task. Thank You For Using PlanHolder :)`,
//         //         from: '+15169814205',
//         //         to: '+918168152757'
//         //     })
//         //     .then(message => console.log(message.sid))
//         //     .catch(error => console.error(error));
//         console.log("msg send");
//         cancelReminder(taskReminder);
//         // console.log(taskReminder);

//         // taskReminder.destroy();
//         // Destroy the cron task to prevent it from running again
//     },{
//         timezone:"Asia/Kolkata",
//     });

//     // console.log("data 1",taskReminder._scheduler);
//     console.log("data 2", taskReminder._scheduler.timeMatcher.pattern);
//     console.log("data 3", taskReminder._scheduler.timeMatcher.expressions);
//     console.log("data 4", taskReminder._scheduler.timeMatcher.dft);
    
//     if(!taskReminder.id){
//         taskReminder.id = "7979b437092b352360vb79";
//     }
//     console.log(taskReminder);

//     // Store task reference in the database
//     return taskReminder;
// }


// // function cancelReminder(reminderId){
// //     const taskReminder = 
// // }

// let taskRef = scheduleReminder({scheduledTime:"50 50 8 27 2 *",owner:"jay",taskName:"demo123"});

// function cancelReminder(taskRef){
//     taskRef.destroy();
//     console.log("reminder is stopped");
// }


// setTimeout(()=>{
//     cancelReminder(taskRef);
// },20000);
// setTimeout(()=>{
//     console.log("server is running dont worry !");
// },30000);



const schedule = require("node-schedule");
const date = "2024-02-27T11:15:30";
console.log(date); 
function createJob(reminder){
    let jobId = "763rbyew7b324yn7gq7"; //use uuid here
    const job = schedule.scheduleJob(jobId,date,()=>{
        console.log("reminder time arrived my dear, msg sending......");
        // callback will run after reminder scheduled time
        // client.messages
        //     .create({
        //         // body: `Hello ${reminder.owner}, this a reminder for your ${reminder.taskName.toUpperCase()} Task. Thank You For Using PlanHolder :)`,
        //         body:"Hello bhaii ajay mein twilio se bol rha hu",
        //         from: '+15169814205',
        //         to: '+918168152757'
        //     })
        //     .then(message => console.log(message.sid))
        //     .catch(error => console.error(error));
        console.log("msg is sent now");
         
    })
    // console.log("job",job);

    return jobId
}



let reminder_id = createJob();


// let current_Jobs = schedule.scheduledJobs;


// setTimeout(()=>{
// // let current = schedule.scheduledJobs[`${reminder_id}`].cancel(); //for cancel return true or false
// // let current = schedule.rescheduleJob(`${reminder_id}`,date)//for cancel return true or false
// // let current = schedule.scheduledJobs.jobId; //undefined

// console.log("current-job cancel hui : ", current);
// },10000);
