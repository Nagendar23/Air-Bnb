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
  .get( wrapAsync(async (req, res) => {
    const { q } = req.query;
    let allListings;
    if (q) {
      allListings = await Listing.find({
        $or: [
          { location: { $regex: q, $options: 'i' } },
          { country: { $regex: q, $options: 'i' } },
          { title: { $regex: q, $options: 'i' } }
        ]
      });
    } else {
      allListings = await Listing.find({});
    }
    res.render('listings/index', { allListings });
  }))
  
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
