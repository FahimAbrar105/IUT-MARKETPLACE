//  https://www.youtube.com/watch?v=SnoAwLP1a-0 (Express Auth)
//  https://youtube.com/playlist?list=PLk8gdrb2DmCiR_TF0Dc0c11E6yDvVOM68&si=KooscOCE8hFseUsw
//  https://www.geeksforgeeks.org/building-an-otp-verification-system-with-node-js-and-mongodb/ 
const User = require('../models/User');

// https://jwt.io/introduction
const jwt = require('jsonwebtoken');

// Generate jwt token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Validate iut email
exports.register = async (req, res) => {
    try {
        const { name, email, password, studentId, contactNumber } = req.body;

        let avatar = 'https://ui-avatars.com/api/?name=' + name + '&background=0b0e11&color=fff&size=128';
        if (req.file) {
            avatar = req.file.path;
        }

        if (!email.endsWith('@iut-dhaka.edu')) {
            return res.status(400).json({ error: 'Registration restricted to @iut-dhaka.edu emails only' });
        }

        if (!/^\d{9}$/.test(studentId)) {
            return res.status(400).json({ error: 'Student ID must be exactly 9 digits' });
        }

        if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(contactNumber)) {
            return res.status(400).json({ error: 'Invalid Bangladesh contact number' });
        }

        const userExists = await User.findOne({
            $or: [{ email }, { studentId }]
        });

        if (userExists) {
            let msg = 'User already exists';
            if (userExists.email === email) msg = 'Email already registered';
            if (userExists.studentId === studentId) msg = 'Student ID already registered';
            return res.status(400).json({ error: msg });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
        console.log(`[DEBUG] Generated OTP for ${email}: ${otp}`);

        const user = await User.create({
            name,
            email,
            password,
            studentId,
            contactNumber,
            avatar,
            otp,
            otpExpires,
            isVerified: false
        });

        const sendEmail = require('../utils/sendEmail');
        const emailTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #CC2936; padding: 20px; text-align: center; color: white;">
                    <h1 style="margin: 0;">IUT Marketplace</h1>
                </div>
                <div style="padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
                    <p style="color: #666; text-align: center; font-size: 16px;">Thank you for joining IUT Marketplace. Please use the verification code below to complete your registration.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="background-color: #fff; padding: 15px 30px; font-size: 24px; font-weight: bold; border: 2px solid #CC2936; border-radius: 5px; color: #CC2936; letter-spacing: 5px;">${otp}</span>
                    </div>
                    <p style="color: #666; text-align: center;">This code will expire in <strong>5 minutes</strong>.</p>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this, please ignore this email.</p>
                </div>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify your ID - IUT Marketplace',
                message: emailTemplate
            });

            res.status(201).json({
                message: 'Registration successful. Please verify your email.',
                action: 'verify-otp',
                email: email
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Registration worked but email failed. Check message logs.' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
// Otp matching
exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(200).json({ message: 'User already verified. Please login.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid Code' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ error: 'Code expired. Please request a new one.' });
        }

        // Verify user
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Log them in
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        // req.login to ensure passport session is active too
        req.login(user, function (err) {
            if (err) { return next(err); }
            if (!user.studentId || !user.contactNumber) {
                return res.json({
                    message: 'Verification successful. Please complete your profile.',
                    action: 'complete-profile'
                });
            }
            return res.status(200).json({
                message: 'Verification successful. Logged in.',
                token: token,
                user: user
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Verify form
exports.verifyForm = (req, res) => {
    res.json({ message: "Send a POST request with 'email' and 'otp' to this endpoint to verify." });
};

// login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.password) {
            return res.status(400).json({ error: 'Please login using your social account (Google/GitHub)' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            if (user.password) {
                return res.status(403).json({
                    error: 'Email not verified',
                    action: 'verify-otp',
                    email: user.email
                });
            }
        }

        // Send token in cookie
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // Responding with json
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

//Logout
exports.logout = async (req, res) => {
    try {
        // Invalidate jwt serverside
        if (req.cookies.token) {
            const decoded = jwt.decode(req.cookies.token);
            if (decoded) {
                const user = await User.findById(decoded.id);
                if (user) {
                    user.lastLogout = Date.now();
                    await user.save();
                }
            }
        }
    } catch (err) {
        console.error("Logout Error:", err);
    }

    // Clear jwt cookie
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    });

    // Destroy passport/express session
    req.logout((err) => {
        if (err) { console.error("Passport Logout Error:", err); }

        req.session.destroy((err) => {
            if (err) { console.error("Session Destroy Error:", err); }

            //  Clear session cookie
            res.clearCookie('connect.sid', { path: '/' });

            //  Redirect home
            res.redirect('/');
        });
    });
};

// show complete profile form

exports.completeProfileForm = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Please login first' });
    }
    res.json({
        message: 'Please complete your profile',
        missingFields: ['studentId', 'contactNumber'],
        user: req.user
    });
};

// Collect missing Student ID/Contact for social login users
exports.completeProfile = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Please login first' });
        }

        const { studentId, contactNumber } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!/^\d{9}$/.test(studentId)) {
            return res.status(400).json({ error: 'Student ID must be exactly 9 digits' });
        }

        if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(contactNumber)) {
            return res.status(400).json({ error: 'Invalid Bangladesh number' });
        }

        const existing = await User.findOne({
            $or: [{ studentId }, { contactNumber }],
            _id: { $ne: user._id }
        });

        if (existing) {
            return res.status(400).json({ error: 'Student ID or Contact Number already in use' });
        }

        user.studentId = studentId;
        user.contactNumber = contactNumber;
        user.isVerified = true;

        if (req.file) {
            user.avatar = req.file.path;
        }

        await user.save();

        // Regenerate JWT token
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Profile completed successfully',
            token,
            user
        });

    } catch (err) {
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

exports.updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file.' });
        }

        const user = await User.findById(req.user.id);
        user.avatar = req.file.path;
        await user.save();

        res.json({ message: 'Profile picture updated!', avatar: user.avatar });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.removeAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.avatar = undefined; // Reset to default
        await user.save();
        res.json({ message: 'Profile picture removed.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};
