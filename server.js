// https://www.youtube.com/watch?v=L72fhGm1tfE (Express.js Crash Course)
// https://expressjs.com/en/starter/hello-world.html
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

dotenv.config();

// https://mongoosejs.com/docs/connections.html
const connectDB = require('./config/db');
connectDB();

// https://www.passportjs.org/docs/
require('./config/passport')(passport);

const app = express();

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

app.use(express.static(path.join(__dirname, 'public')));

const { checkUser } = require('./middleware/checkUser');
app.use(checkUser);

app.use('/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to IUT Marketplace API', user: req.user });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
