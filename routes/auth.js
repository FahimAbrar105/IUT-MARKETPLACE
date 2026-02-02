// Auth: https://youtu.be/6FOq4cUdH8k?si=CpxiMbVsN-prrvD8
// Source: https://expressjs.com/en/guide/routing.html
const express = require('express');
const router = express.Router();
const { register, login, logout, verifyOtp, verifyForm } = require('../controllers/authController');

const upload = require('../middleware/upload');

router.get('/register', (req, res) => res.json({ message: "POST to /auth/register to create an account" }));
router.post('/register', upload.single('avatar'), register);

router.get('/verify', verifyForm);
router.post('/verify', verifyOtp);

router.get('/login', (req, res) => res.json({ message: "POST to /auth/login to authenticate" }));
router.post('/login', login);

router.get('/logout', logout);

const { completeProfileForm, completeProfile } = require('../controllers/authController');
router.get('/complete-profile', completeProfileForm);
router.post('/complete-profile', upload.single('avatar'), completeProfile);

const { updateAvatar, removeAvatar } = require('../controllers/authController');
// Avatar Management
const { protect } = require('../middleware/auth');

router.post('/update-avatar', protect, upload.single('avatar'), updateAvatar);
router.post('/remove-avatar', protect, removeAvatar);
module.exports = router;