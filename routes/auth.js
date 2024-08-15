const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// @route POST /api/auth/login
// @desc  Authenticate user and get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Log the username and password in the backend console
    console.log(`User Typed: Email - ${email}, Password - ${password}`);

    try {
        let user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            return res.status(400).json({ msg: 'No User registered in the given username' });
        }

        // Log the stored password for debugging
        console.log(`Stored Password: ${user.password}`);

        // Check the stored password and compare using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        // Log the result of the password comparison
        console.log(`Password Match: ${isMatch}`);

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ msg: 'Wrong Password' });
        }

        // Generate a token
        const payload = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Log the generated token
        console.log(`Generated Token: ${token}`);

        res.json({ msg: 'Login successful', token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
