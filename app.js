if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

const userRouter = require("./routes/user.js");

// Connection to MangoDB =>
const mongo_url = "mongodb://127.0.0.1:27017/wanderLust";

// Connection to Mango Atlas for Deployment =>
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderLust";


main().then(() =>{
    console.log("connected to DB");
}).catch((err) =>{
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);   
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// connection for mongo atlas using npm connect-mongo =>
    const store = MongoStore.create({
        mongoUrl: dbUrl,
        crypto: {
            secret: process.env.SECRET 
        },
        touchAfter: 24 * 3600,
    });

store.on("error", (err) =>{
    console.log("ERROR in MONGO_SESSION STORE", err);
});

// Using Session(Express)=>
const sessionOptions = {
    store,
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};



// Root Router =>
    // app.get("/", (req, res) =>{
    //     res.send("Hii, I am root");
    // });

/********************************************************************************************** */

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

/********************************************************************************************************/ 

// Flash Middleware =>
app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    console.log("Current User:", req.user); // Debugging
    res.locals.currUser = req.user || null;
    next();
});

// Demo User =>
// app.get("/demouser", async(req, res) =>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "sigma-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

// Express Router =>
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) =>{
    next(new expressError(404, "Page Not Found!"));
});

// Error Middleware =>
app.use((err, req, res, next) =>{
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
});

app.listen(8001, () =>{
    console.log("app is listening to port 8001");
});