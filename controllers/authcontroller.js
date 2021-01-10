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
        return next( new AppError('Please provide your email and password!!!', 400));
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