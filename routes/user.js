const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { savedRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/user.js');

// signup route
router.route('/signup')
.get(userController.renderSignup )

.post(wrapAsync(userController.signup));

// login route
router.route('/login')
.get( userController.renderLogin)

.post(  savedRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    userController.login
);

// logout route
router.get('/logout', userController.logout);

module.exports = router;
