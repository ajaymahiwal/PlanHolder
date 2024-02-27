

const cron = require("node-cron");

let job1 ;
function createJob(){
     job1 = cron.schedule("59 47 15 27 2 *",()=>{
        console.log("Hello Buddyy !");
    },{
        // scheduled: false,
        timezone: "Asia/Kolkata"

    });
    let job2 = cron.schedule("15 15 27 2 *",()=>{
        console.log("Hello Buddyy !");
    });


    console.log(job1);

    console.log(cron.getTasks());
}

createJob();

setTimeout(()=>{
    job1.stop();
    console.log("job stopped")
},10000);