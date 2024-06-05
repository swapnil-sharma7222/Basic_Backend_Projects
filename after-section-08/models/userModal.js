const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A name is a must']
    },
    email: {
        type: String,
        required: [true, 'An email is a must'],
        unique: [true, 'This email is already taken'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'A password is a must'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password confirmation is a must'],
        minlength: 8,
        validate: {
            validator: function (ele) {
                return this.password === ele;
            },
            message: 'Passwords do not match'
        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
