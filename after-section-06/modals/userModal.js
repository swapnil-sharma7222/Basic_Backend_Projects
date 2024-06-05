const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt= require('bcrypt');

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
        minlength: 8,
        select: false
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
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', async function(next){
    // DO NOTHING IN CASE THE PASSWORD IS NOT MODIFIED
    if(!this.isModified('password')) return next();

    // ENCRYPTING THE PASSWORD IS IT WERE NEWLY CREATED OT MODIFIED
    this.password= await bcrypt.hash(this.password, 12);

    // TO NOT TO SAVE THE PASSWODCOMFIRE SECTION IN THE DB AS IT WAS JUST TO CONFIRM THAT THE USER HAD ENTERED A CORRECT PASSWORD
    this.passwordConfirm= undefined;

    next();
});

userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this. find({active: {$ne: false}});
    next();
});

// THIS IS AN INSTANCE METHOD AND AVAILALE ACROSS ALL USER RELATED FILES
userSchema.methods.correctPassword= async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.isPasswordChanged= function(JWTTimestamp){
    const passwordChangeTimestamp= this.passwordChangedAt.getTime()/ 1000;
    if(passwordChangeTimestamp){
        // console.log(passwordChangeTimestamp, JWTTimestamp);
        return JWTTimestamp< passwordChangeTimestamp;
    }
    return false;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
