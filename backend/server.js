n// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/user');

const app = express();
app.use(cors()); // allow frontend to call backend
app.use(express.json()); // parse JSON body

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/nutritrack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Signup Route
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already exists' });

        const user = new User({ email, password });
        await user.save();
        res.json({ userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Personal Info Route
app.post('/personal', async (req, res) => {
    const { userId, name, age, height, weight } = req.body;
    try {
        const user = await User.findByIdAndUpdate(userId, {
            name, age, height, weight
        }, { new: true });

        if(!user) return res.status(400).json({ error: 'User not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Info
app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(400).json({ error: 'User not found' });
        res.json({ user });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
