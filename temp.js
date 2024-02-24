let date = Date.UTC(2024,1,21);
let today = Date.now();

console.log(today,date);
console.log(today > date);

console.log(Date);
let arr = "2024-02-20T00:00:00.000Z".split("-");
console.log(arr);
arr = arr[2].split("T");
console.log(arr);
arr = arr[1].split(":");
console.log(arr);


