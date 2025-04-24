const Listing = require('./models/listing');
const { listingSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');
const { reviewSchema } = require('./schema.js');
const Review = require('./models/review.js'); // ✅ Renamed from 'review' to 'Review'

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
};

// to keep track of the redirect url
module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not the owner of this listing!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Validate listing middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);  // Validate req.body directly
    console.log('error in validation', error);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Validate review middleware
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// ✅ Corrected review author check middleware
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId); // ✅ Uses 'Review' instead of 'review'

    if (!review) {
        req.flash('error', 'Review not found!');
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not the author of this review!');
        return res.redirect(`/listings/${id}`);
    }

    next();
};
