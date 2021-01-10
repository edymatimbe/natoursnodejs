const express = require('express');
const userController = require ('../controllers/usercontroller');
const authController = require ('../controllers/authcontroller');


const router = express.Router();

// Routes

// router
//   .route('/signup')
//   .post(authController.signUp);

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);

router
  .route('/')
  .get(userController.getUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;