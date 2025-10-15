const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    age: Number,
    height: Number,
    weight: Number
});

module.exports = mongoose.model('User', userSchema);
