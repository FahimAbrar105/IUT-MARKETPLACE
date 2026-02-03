// https://www.youtube.com/watch?v=mbsmsi7l3r4 (JWT Auth Tutorial)
// https://jwt.io/introduction
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    //  Extract token from cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.redirect('/');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            res.clearCookie('token');
            return res.redirect('/auth/login');
        }

        if (!req.user.isVerified) {
            return res.redirect(`/auth/verify?email=${req.user.email}`);
        }

        //  Check if token was issued before the last logout
        if (req.user.lastLogout) {
            const lastLogoutTime = new Date(req.user.lastLogout).getTime() / 1000;
            if (decoded.iat < lastLogoutTime) {
                res.clearCookie('token');
                return res.redirect('/auth/login');
            }
        }

        //  prevent caching of protected pages
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err.message);
        res.clearCookie('token');
        return res.redirect('/');
    }
};