if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError =require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouwter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
 
// const Mongo_url="mongodb://127.0.0.1:27017/wanderlust";
 
const dbUrl = process.env.ATLASDB_URL;


// main()
// .then(() =>{
//     console.log("connected to DB");
// })
//  .catch((err) =>{
//     console.log("Error",err);
//  })

// //  "mongodb+srv://happycoding55:yadav7783@cluster0.cjxcr.mongodb.net/Testing"
//    async function main() {
//     // await mongoose.connect(dbUrl);
//     await mongoose.connect(Mongo_url)
//     console.log("connected successful");
    
    
//    }

  //  checking
  
  const main =async()=>{
    await mongoose.connect(dbUrl)
}

main().then(
    console.log("Database connected ")
    
).catch((err)=>{
    console.log("error occurs");
    console.log(err);
    
    
})
 
   app.set("view engine", "ejs");
   app.set("views", path.join(__dirname, "views"));
   app.use(express.urlencoded({ extended: true }));
   app.use(methodOverride("_method"));
   app.engine("ejs", ejsMate);
   app.use(express.static(path.join(__dirname, "/public")));



   const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET,
    },
      touchAfter: 24 * 3600,

  });
   
    store.on("error", ()=>{
      console.log("ERROR in Mongo Session Store", err);
    });


   const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:  false,
    saveUnitialised: true,
    cookie:{
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7*24*60*60*1000,
      httpOnly: true,
    },
   };

     
     
// app.get("/", (req, res) => {
//     res.send("hi, I am root");
// });
  

   
  
     app.use(session(sessionOptions));
     app.use(flash());


     app.use(passport.initialize());
     app.use(passport.session());
     passport.use(new LocalStrategy(User.authenticate()));

     passport.serializeUser(User.serializeUser());
     passport.deserializeUser(User.deserializeUser());


     app.use((req, res, next) =>{
       res.locals.success=req.flash("success");
       res.locals.error = req.flash("error");
       res.locals.currUser= req.user; 
       next();
     })
       

    //  app.get("/demouser", async (req, res) => {
    //    let fakeUser =  new User({
    //     email: "mausim@gamil.com",
    //     username: "delta-student"
    //    });

    //     let registeredUser = await User.register(fakeUser, "helloworld");
    //     res.send(registeredUser);
    //  })


 app.use("/listings", listingRouter);
 app.use("/listings/:id/reviews", reviewRouwter);
 app.use("/", userRouter);


  app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page Not Found!"));
  });

  app.use((err, req, res, next) =>{
  let{statusCode=500, message = "Something went wrong!"}= err;
  res.status(statusCode).render("error.ejs", {err});
//  res.status(statusCode).send(message);
});

app.listen(8080, () =>{
    console.log("server is listening to port 8080");
});