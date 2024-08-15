const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const bcrypt = require('bcryptjs'); // Add this line
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin:"code.tarcinrobotic.in",
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        // Create a default user if not exists
        const defaultUserEmail = 'tarcinadmin';
        const defaultUserPassword = 'tarcinadmin';

        let user = await User.findOne({ email: defaultUserEmail });
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(defaultUserPassword, salt);

            user = new User({
                email: defaultUserEmail,
                password: hashedPassword, // Store as hashed
            });
            await user.save();
            console.log('Default user created:', defaultUserEmail);
        } else {
            console.log('Default user already exists:', defaultUserEmail);
        }
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

// Start the server
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
