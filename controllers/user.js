const User = require('../models/user');

module.exports.renderSignup = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust!');

            const redirectUrl = req.session.redirectUrl || '/listings';
            delete req.session.redirectUrl;

            res.redirect(redirectUrl);
        });

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back to Wanderlust! You are logged in');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "You are logged out!");
        res.redirect('/listings');
    });
}