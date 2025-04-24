const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new ExpressError(404, "Listing not found");
  
    let { content, rating } = req.body.review;
    let newReview = new Review({ content, rating });
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'New review added!');
    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!');
    res.redirect(`/listings/${id}`);
  }