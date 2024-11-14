const Listing = require("./models/listing");
const Review = require("./models/review");
const expressError = require("./utils/expressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");



// Middleware check if User is logged in. =>
module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

// Middleware to save req.session.redirectUrl =>
module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// Middleware to check if currUser == listing_Owner
module.exports.isOwner = async (req, res, next) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the Owner of this Listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Server side validation =>
    
    module.exports.validateListing = (req, res, next) =>{
        let {error} = listingSchema.validate(req.body);
        if(res.erorr){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new expressError(400, errMsg);
        } else {
            next();
        }
    };

// Server Side Validations =>

    module.exports.validateReview = (req, res, next) =>{
        let {error} = reviewSchema.validate(req.body);
        if(res.erorr){
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new expressError(400, errMsg);
        } else {
            next();
        }
    };


// Middleware to check if review_author == login_author

module.exports.isReviewAuthor = async (req, res, next) =>{
    let { id,  reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You did not create this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};