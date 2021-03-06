const AuthController = require('../controllers/auth');
const UserController = require('../controllers/users');
const ProfileController = require('../controllers/profiles');
const express = require('express');
const router = express.Router();

router.get('/', AuthController.getUserFromToken);

router.get('/avatar/:userId', UserController.getAvatarFromUserId)

router.post('/forgot', AuthController.sendForgotPassword);

router.put('/reset-password/:token', AuthController.resetPassword);

router.get(
  '/posts',
  AuthController.verifyToken,
  UserController.getAllPostFromUserToken
);

router.get('/posts/:userId', UserController.getAllPostFromUserId);

router.get(
  '/modules',
  AuthController.verifyToken,
  UserController.getFollowedModulesFromUni
);

router.post(
  '/changename',
  AuthController.verifyToken,
  ProfileController.editName
);

router.get('/verify/:token', AuthController.verify);

/*
 * Register route
 */
router.post('/register', AuthController.register);

/*
 * Login route
 */
router.post('/login', AuthController.login);

/*
 * Follow module route
 */
router.put(
  '/follow/:moduleId',
  AuthController.verifyToken,
  UserController.followModule
);

/*
 * Unfollow module route
 */
router.put(
  '/unfollow/:moduleId',
  AuthController.verifyToken,
  UserController.unfollowModule
);

module.exports = router;
