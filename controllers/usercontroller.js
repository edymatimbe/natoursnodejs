const User = require('../models/usermodel');
const catchAsync = require('../utils/catchasync');

exports.getUsers =  catchAsync (async (req, res) => {
  // const features = new APIFeatures(
  //   User.find(), req.query)
  //   .filter()
  //   .sort()
  //   .limits()
  //   .pages();

  const users = await User.find(req.query);

  // Third Send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {users }
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
}

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
}

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  })
}