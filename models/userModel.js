const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    date: {
        type: Date,
        required: false,
        default: Date.now
    },
    pictures: {
        type: Array,
        required: false,
        default: []
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    characteristics: {
        animal: {
            type: String,
            required: false,
            default: '' 
        },
        race: {
            type: String,
            required: false,
            default: ''
        },
        age: {
            type: Number,
            required: false,
            default: 0
        },
        weight: {
            type: Number,
            required: false,
            default: 0
        },
        interests: {
            type: Array,
            required: false,
            default: []
        },
        favoriteFoods: {
            type: Array,
            required: false,
            default: []
        },
        default: {}
    },
    liking: {
        type: Array,
        required: false,
        default: []
    },
    liked: {
        type: Array,
        required: false,
        default: []
    },
    matches: {
        type: Array,
        required: false,
        default: []
    } 
});
const User = mongoose.model('User', userSchema);
module.exports = User;