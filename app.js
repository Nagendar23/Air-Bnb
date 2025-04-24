if(process.env.NODE_ENV != 'production'){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

// Routes
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

// View engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => console.log('Connected to DB'))
  .catch((err) => console.log(err));

// ✅ Fixed typos in session options
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true, // ✅ Fixed typo from "saveUninitalized"
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true, // ✅ Fixed typo from "httOnly"
  }
};

// Test route
app.get('/', (req, res) => {
  res.send('The port is working');
});

// Session & Flash
app.use(session(sessionOptions));
app.use(flash());

// Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware to make flash messages and user available in all templates
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

// Optional demo user creation route (commented)
// app.get('/demouser', async (req, res) => {
//   let fakeUser = new User({
//     email: 'student@gmail.com',
//     username: 'student',
//   });
//   let registerUser = await User.register(fakeUser, 'helloworld');
//   res.send(registerUser);
// });

// Routes
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('listings/error', { message });
});

// Start server
const port = 8000;
app.listen(port, () => {
  console.log(`The server is running on port ${port}`);
});
