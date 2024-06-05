const user= require('./../modals/userModal');

exports.getAllUsers = async (req, res) => {
    try {
        const allUsers= await user.find();
        res.status(200).json({
            status: 'success',
            message: 'these are all the users',
            results: allUsers.length,
            data: {
                allUsers: allUsers
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
    }
};

exports.updateMe= async (req, res, next)=> {
    try {
        await user.findByIdAndUpdate(req.user.id, {active: false});
    
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
        // console.log(error);
    }
}
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const deleteUsers = await user.findByIdAndDelete(id);
        if (!deleteUsers) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found',
            });
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        // Handle any other errors that may occur during the deletion process
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
};

exports.deleteMe= async (req, res, next)=> {
    try {
        await user.findByIdAndUpdate(req.user.id, {active: false});
    
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        });
        // console.log(error);
    }
};

exports.deleteAllUsers = async (req, res) => {
    try {
        const noUsers= await user.deleteMany();
        res.status(200).json({
            status: 'success',
            message: 'No more user left',
            results: noUsers.length,
            data: {
                noUsers: noUsers
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message
        })
    }
};
