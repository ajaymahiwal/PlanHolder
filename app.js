
require('dotenv').config()

const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const mongoose = require("mongoose");
const {User} = require("./models/User");
const {Task} = require("./models/Task");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const methodOverride = require("method-override");


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
app.use(methodOverride("_method"));
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
        let checkUser = await User.findOne({username});
        if(!checkUser){
            const regUser = await User.register(user,password);

            req.login(regUser,(err)=>{
                if(err){
                    res.redirect("/signup");
            }
            console.log("Successful new account is created. and login done");
            res.redirect("/dashboard");
            })
        }
        else{
            req.flash("error","Username already exits, So Direct Login.");
            res.redirect("/login");
        }
        
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

app.post("/login",passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,successFlash:true}),(req,res)=>{
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



app.use("/tasks",(req,res,next)=>{
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
});

//Task -  CRUD operations
app.get("/tasks",async (req,res)=>{
    console.log(req.user);
    // let u = req.user;
    let user = await User.findById(req.user._id).populate('tasks');
    res.render("./task/tasks.ejs",{user});
})
app.get("/tasks/new",(req,res)=>{
    res.render("./task/new.ejs");
})
app.post("/tasks/new",async (req,res)=>{
    let {task} = req.body;
    let newtask = new Task({...task});
    await newtask.save();

    let upuser = await User.findByIdAndUpdate(req.user._id,{tasks:[...req.user.tasks,newtask._id]},{new:true,runValidators: true});

    console.log(upuser);
    res.redirect("/tasks");
})

app.get("/tasks/:id",async(req,res)=>{
    let id = req.params.id;
    let task = await Task.findById(id);
    res.render("./task/showtask",{task});
})

app.get("/tasks/:id/edit",async(req,res)=>{
    let id = req.params.id;
    let task = await Task.findById(id);
    res.render("./task/edit",{task});
})

app.put("/tasks/:id",async(req,res)=>{
    let id = req.params.id;
    let {task} = req.body;

    let newTask = await Task.findByIdAndUpdate(id,{...task},{new:true,runValidators: true});
    // await newTask.save();
    console.log("old Task",newTask);

    res.redirect(`/tasks/${id}`);
})
app.delete("/tasks/:id",async(req,res)=>{
    let id = req.params.id;
    let delTask = await Task.findByIdAndDelete(id);
    console.log("task deleted", delTask);

    res.redirect("/tasks");
})







app.use((err,req,res,next)=>{
    console.log(err);
    res.send("Error Occured !");
})

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});