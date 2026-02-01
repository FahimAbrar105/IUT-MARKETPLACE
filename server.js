// Express App Setup
// Tutorial: https://www.youtube.com/watch?v=L72fhGm1tfE (Express.js Crash Course)
// Source: https://expressjs.com/en/starter/hello-world.html
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load env vars
dotenv.config();

// Connect to DB
// Source: https://mongoosejs.com/docs/connections.html
const connectDB = require('./config/db');
connectDB();

// Passport Config
// Source: https://www.passportjs.org/docs/
require('./config/passport')(passport);

const app = express();

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const flash = require('connect-flash');

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Static Files Serving
app.use(express.static(path.join(__dirname, 'public')));

// Custom Middleware for User Checking
const { checkUser } = require('./middleware/checkUser');
app.use(checkUser);

// Route Definitions
app.use('/auth', require('./routes/auth'));

// Home Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to IUT Marketplace API', user: req.user });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
