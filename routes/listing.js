const express = require('express');
  const router = express.Router();
  const wrapAsync = require('../utils/wrapAsync.js');
  const Listing = require('../models/listing.js');
  const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
  const multer  = require('multer')
  const listingController = require('../controllers/listing.js');
  const { cloudinary } = require('../cloudConfig.js');
  const { storage } = require('../cloudConfig.js');  
  const upload = multer({ storage})


  // /route
  router.route('/')
  .get( wrapAsync(listingController.index))
  
  .post(isLoggedIn,  upload.single('listing[image]'), wrapAsync(listingController.createListing));

  // New - Show form to create new listing
  router.get('/new', isLoggedIn, listingController.renderNewForm );

  // /:id route
  router.route('/:id')
  .get( wrapAsync(listingController.showListing))
  
  .put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))

  .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

  // Edit - Show form to edit an existing listing
  router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


  module.exports = router;
