

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

console.log(Date.now());
//1709104219841
console.log(  new Date(Date.now())  );
//2024-02-28T07:10:19.866Z
console.log( new Date(Date.now()).toLocaleString(undefined,{timezone:"Asia/Kolkata"}) );
//2/28/2024, 12:40:19 PM
console.log( Date.parse(new Date(Date.now()).toLocaleString("en-GB",{timezone:"Asia/Kolkata"})) );
//NaN

let localeString = new Date(Date.now()).toLocaleString(undefined,{timezone:"Asia/Kolkata"}) ;
let arr = localeString.split("/"); //[ '2', '28', '2024, 12:44:39 PM' ]
arr = arr[2].split(","); //[ '2024', ' 12:46:44 PM' ]


console.log(arr[1].split(":")) //[ ' 12', '47', '43 PM' ]

// console.log(new Date(Date.now()).toLocaleString(undefined,{timezone:"Asia/Kolkata"}));