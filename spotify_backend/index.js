// npm init: package.json -- This is a node project
// npm i express: expressJs package install hogya. -- project came to know that we are using express
// we finally use express

const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
const playlistRoutes = require("./routes/playlist");
require("dotenv").config(); // to hide password
const cors = require("cors");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// connect mongodb to out node app
// mongoose.connect() takes 2 arguments:
// 1. which db to connect to (db url)
// 2. connection option 
// mongodb+srv://rahulbhola2804:<password>@cluster0.4v1fjy5.mongodb.net/?retryWrites=true&w=majority
const uri= "mongodb+srv://rahulbhola2804:"+process.env.MONGO_PASSWORD+"@cluster0.4v1fjy5.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri,{useNewUrlParser: true,useUnifiedTopology: true})
    .then((x)=>{
        console.log("Connected to Mongo!");
    })
    .catch((err)=>{
        console.error("Error while connecting to mongo");
    });

// set passport-jwt
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'thisKeyIsSupposedToBeSecret'; 
opts.secretOrKey = "rahulbhola798"; 

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload.identifier}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));



// API: GET type: / : return text "Hello World"
app.get("/", (req, res) => {
    // req contains all data for request
    // res contain all data for response 
    res.send("Hello World");
});
app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", playlistRoutes);


// Now we want to tell express thatour server will run on localhost:8000
app.listen(port,()=>{
    console.log("App is running on port " + port);
});