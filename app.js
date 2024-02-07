
require('dotenv').config()

const express = require("express");
const app = express();
const path = require("path");

//Project Setup settings
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// Universal Middlewares
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.render("./main/home.ejs");
});

app.get("")


const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});