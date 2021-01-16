const { promisify } = require('util');
const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchasync');
const AppError = require('../utils/apperror');

const signToken = (id) => {
    return jwt.sign({ id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN 
    });
}

exports.signUp = catchAsync (async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });
    
    // const newUser = await User.create(req.body);

    const token =  signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: { user: newUser }
    });
});

exports.signIn = catchAsync (async (req, res, next) => {
    const {email, password} = req.body;

    // 1) Check if email and password exist
    if(!email || !password) {
        return next( new AppError('Please provide your email and password!', 400));
    }
    // 2) Check if user exists && password
    const user = await User.findOne({email}).select('+password');
    const correct = await user.correctPassword(password, user.password);

    if(!user || !correct) {
        return next(new AppError('Incorrect email or password', 401))
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token 
    });
});

exports.protectRoutes = catchAsync(async(req, res, next) => {
    // 1 - Getting token and check of it's there
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return next(new AppError('You\'re not logged in, please signin', 401))
    }
    // 2 - Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   
    // 3 - CHeck if user still exists
    const freshUser = await User.findById(decoded.id);
    if(!freshUser) {
        return next (new AppError('The token don\'t belongs to user, user no longer exist', 401));
    }
    // Check if user changes password after jwt was issued
    freshUser.changedPasswordAfter(decoded.iat);

    
    next();
})