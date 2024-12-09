const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

 const listingcontroller = require("../controller/listings.js")
 const multer  = require('multer')
 const {storage} = require("../cloudConfig.js");
 const upload = multer({ storage  })

 //Index Route
 router.get("/", wrapAsync(listingcontroller.index));

    //New Route
    router.get("/new", isLoggedIn, (req, res) => {  
    res.render("listings/new.ejs");
  });
    
    //Show Route
    router.get("/:id", wrapAsync(listingcontroller.renderShowRoutes)) ;

  //Create Route
   router.post("/", 

      isLoggedIn,
      
      upload.single('listing[image]'),
      validateListing,
       wrapAsync(listingcontroller.RenderCreateRoutes)
);

  

  //Edit Route
  router.get("/:id/edit", 
     isLoggedIn, 
     isOwner,
     wrapAsync(listingcontroller.RenderEditRoutes));
  
  //Update Route
  router.put("/:id", 
     isLoggedIn,
     isOwner,
     upload.single('listing[image]'),
     validateListing,
     wrapAsync(listingcontroller.RenderUpdatesRoutes));

  //Delete Route
  router.delete("/:id", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingcontroller.RenderDestroyRoutes));

  module.exports=router;