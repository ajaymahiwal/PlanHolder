

const dropBtn_1 = document.getElementById("drop-btn-1");
const dropSection_1 = document.querySelector(".drop-out-1");

dropBtn_1.addEventListener('click',(event)=>{
    
    if(!dropSection_2.classList.contains("dropout-unactive")){
        dropSection_2.classList.add("dropout-unactive");
    }
    dropSection_1.classList.toggle("dropout-unactive");
});


const dropBtn_2 = document.getElementById("drop-btn-2");
const dropSection_2 = document.querySelector(".drop-out-2");

dropBtn_2.addEventListener('click',(event)=>{

    if(!dropSection_1.classList.contains("dropout-unactive")){
        dropSection_1.classList.add("dropout-unactive");
    }
    dropSection_2.classList.toggle("dropout-unactive");
    
    
});



