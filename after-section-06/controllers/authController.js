const {promisify}= require('util');
const user= require('./../modals/userModal');
const jwt= require('jsonwebtoken');
const { decode } = require('punycode');

exports.signup= async (req, res, next)=> {
    try {
        const newUser= await user.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            passwordChangedAt: req.body.passwordChangedAt
        });

        const token= jwt.sign({
            id: newUser._id}, 
            process.env.jwtSecret,{
                expiresIn: process.env.jwtExpireTime
            }
        );
    
        res.status(201).json({
            status: 'success',
            token,
            data: {
                newUser: newUser
            }
        });
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.login= async (req, res, next) => {
    const email= req.body.email;
    const password= req.body.password;

    try {
        // IF EAMIL OR PASSWORD ACTUALLY EXISTS
        if(!email || !password){
            throw new Error('Please provide email or password');
        }
    
        // CHECK IF THE EMAILID OR PASSWORD IS CORRECT OR NOT

        //Getting the users email and password
        const currUser= await user.findOne({email: email}).select('+password'); 
        // Checking if the email exists and entered password is correct
        // The correctPassword is an instance method and is present in userModal file
        if(!currUser || !(await currUser.correctPassword(password, currUser.password))){
            throw new Error('Email or Password is not correct');
        }
        // If the password is correct the generate the token
        const token= jwt.sign({
            id: currUser._id}, 
            process.env.jwtSecret,{
                expiresIn: process.env.jwtExpireTime
            }
        );
        res.status(200).json({
            status: 'success',
            token,
            data: {
                currUser: currUser
            }
        });
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.protect= async (req, res, next) => {
    try {
        // CHECK IF THE TOKEN STILL EXISTS
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token= req.headers.authorization.split(' ')[1];
        }
        console.log(token);
        // TOKEN VERIFICATION
        if(!token){
            throw new Error('OOPss!! You are not logged in. Please try again after logging in!!');
        }
        // THE SESSION IS NOT TIMED OUT
        const decoded= await promisify(jwt.verify)(token, process.env.jwtSecret);

        // CHECK IF USER STILL EXISTS
        const currUser= await user.findById(decoded.id);
        if(!currUser){
            throw new Error('OOPss!!, The user does not exists!!');
        }

        // IF USER CHANGED PASSWORD AFTER THE TOKEN US ISSURED
        if(await currUser.isPasswordChanged(decoded.iat)){
            throw new Error('OOPss!!, The password was changed. Please login again!!');
        }

        //GRANT ACCESS TO THE USER
        req.user= currUser;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'fail',
                message: 'Token has expired. Please log in again.',
            });
        }

        res.status(401).json({
            status: 'fail',
            message: error.message
        });
    }
};

