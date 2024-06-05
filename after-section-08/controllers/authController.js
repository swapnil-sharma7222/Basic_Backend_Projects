const user= require('./../models/userModal');

exports.signup= async (req, res, next)=> {
    try {
        const newUser= await user.create(req.body);
    
        res.status(201).json({
            status: 'success',
            data: {
                newUser: newUser
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
};

exports.signin= async (req, res, next)=> {
    try {
        const {email}= req.body;
        const newUser= await user.findOne(email);
    
        res.status(201).json({
            status: 'success',
            data: {
                newUser: newUser
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        });
    }
};