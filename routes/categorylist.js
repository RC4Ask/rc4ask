const CategoryListController = require('../controllers/categorylist')
const AuthController = require('../controllers/auth')
const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()

/*
 * Retrieves all universities
 */
router.get(
  '/',
  CategoryListController.getCategoryList
);

/*
 * Create new university and module
 */
router.post(
  '/create',
  AuthController.verifyToken,
  auth.roleAuthorization(['admin', 'superadmin']),
  CategoryListController.createCategoryAndModule
)

module.exports = router
