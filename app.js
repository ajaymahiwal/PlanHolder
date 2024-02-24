
require('dotenv').config()

const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');
const mongoose = require("mongoose");
const { User } = require("./models/User");
const { Task } = require("./models/Task");
const { Newsletter } = require("./models/Newsletter");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const GoogleUserAuth = require("./auth/Google");
const flash = require("connect-flash");
const methodOverride = require("method-override");

//middlewares
const isAuthenticated = require("./middlewares/isAuthenticated"); 

// routers
const taskRouter = require("./routers/tasks");
const userRouter = require("./routers/users");
const listRouter = require("./routers/lists");
const mainRouter = require("./routers/main");

const MONGO_URL = 'mongodb://127.0.0.1:27017/taskmgt';
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected with DB.");
    })
    .catch((err) => {
        console.log("ERROR ERROR ERROR");
        console.log("Can't Connected With DB. See Error.");
    });


//Project Setup settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Universal Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({
    secret: 'ajaymahiwal',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, //http hai ab hmare pass isliye
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new GoogleStrategy(GoogleUserAuth.credentials,GoogleUserAuth.callbackFunx));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



app.use("/tasks", isAuthenticated);
app.use("/tasks", taskRouter);

app.use("/lists", isAuthenticated);
app.use("/lists", listRouter);

app.use("/user", isAuthenticated);
app.use("/user", userRouter);

app.use("/", mainRouter);



app.get("/thank-you",(req,res)=>{
    let{isEmailExist,user_email,pastPath} = req.query;
    // console.log(pastPath);
    if(isEmailExist === "null"){
        isEmailExist = null;
    }
    res.render("./other/thanku.ejs",{isEmailExist,user_email,pastPath});
    // default value di hai yha per user_email section mein
    // ager already exist kerti hogi email to isEmailExist.email se access ker lege fronted mein or user_email value will be null in that case but if new email hui to email fir user_email.email se access ker lege user email account or isEmailExist ki null value hogi
});

app.post("/newsletter/email",async(req,res)=>{
    let {email} = req.body;
    
    if(email){
        let isAlreadyExist = await Newsletter.findOne({email});
    if(isAlreadyExist){
        isAlreadyExist = "yes,email already exists."
    }else{
        let new_emailForNewsletter = new Newsletter({email});
        await new_emailForNewsletter.save();
        // console.log(new_emailForNewsletter);
    }
    res.redirect(`/thank-you?isEmailExist=${isAlreadyExist}&user_email=${email}&pastPath=${req.query.pastPath}`);
    }else{
        console.log("Past Path Was => ",req.query.pastPath);
        req.flash("error","Please Give Right Email Account :)")
        res.redirect(`${req.query.pastPath}`);
    }
});






app.all("*", (req, res) => {
    res.render("./other/error404");
});

app.use((err, req, res, next) => {
    console.log(err);
    // res.send("Error Occured !");
    res.render("./other/all-error",{err});
});




const port = process.env.PORT || 5000;

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function () {
    console.log(`Server is Listing On Port ${port}`);
});