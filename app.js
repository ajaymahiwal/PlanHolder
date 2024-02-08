
require('dotenv').config()

const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const mongoose = require("mongoose");
const {User} = require("./models/User");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");


const MONGO_URL = 'mongodb://127.0.0.1:27017/taskmgt';
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connected with DB.");
})
.catch((err)=>{
    console.log("ERROR ERROR ERROR");
    console.log("Can't Connected With DB. See Error.");
});

//Project Setup settings
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// Universal Middlewares
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))

app.use(flash());
app.use(session({
    secret: 'ajaymahiwal',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, //http hai ab hmare pass isliye
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
     }
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});




app.get("/",(req,res)=>{
    res.render("./main/home.ejs");
});

app.get("/test",(req,res)=>{
    res.render("test.ejs");
});

app.get("/signup",(req,res)=>{
    res.render("./user/signup.ejs");
});

app.post("/signup",async(req,res,next)=>{
    try{
        let {name,username,password} = req.body.user;
        let email = username;
        const user = new User({name,username,email});
        const regUser = await User.register(user,password);

        req.login(regUser,(err)=>{
            if(err){
                res.redirect("/signup");
            }
            console.log("Successful new account is created. and login done");
            res.redirect("/dashboard");
        })
    }
    catch(err){
        console.log("ERROR on signup post route.");
        console.log(err);
        next(err);
    }
});

app.get("/dashboard",(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/signup");
    }
},(req,res)=>{
    res.send("<h1>Hello bete kse ho !</h1>");
});

app.get("/login",(req,res)=>{
    res.render("./user/login");
});

app.post("/login",passport.authenticate("local",{failureRedirect:"/login"}),(req,res)=>{
    console.log("login complete");
    res.redirect("/dashboard");
});

app.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }

        req.flash("success","You Are Logged Out!");
        res.redirect("/");
    });
});


app.use((err,req,res,next)=>{
    res.send("Error Occured !");
})

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});