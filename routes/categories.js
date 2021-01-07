const CategoryController = require('../controllers/categories')
const ModuleController = require('../controllers/modules')
const AuthController = require('../controllers/auth')
const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()

/*
 * Get particular university info
 */
router.get(
  '/:categoryAcronym',
  CategoryController.getCategoryInfoAcronym
)

/*
 * Get particular university info
 */
router.get(
  '/name/:categoryName',
  CategoryController.getCategoryInfoName
)

/*
 * Creates a university
 */
router.post(
  '/add',
  AuthController.verifyToken,
  auth.roleAuthorization(['admin', 'superadmin']),
  CategoryController.createCategory
)

/*
 * Deletes a university
 */
router.delete(
  '/delete',
  AuthController.verifyToken,
  auth.roleAuthorization(['admin', 'superadmin']),
  CategoryController.deleteCategory
)

/*
 * Retrieves all modules in that university
 */
router.get(
  '/modules/:categoryName',
  CategoryController.getModuleList
);

/*
 * Get module info from acronym and module name
 */
router.get(
  '/modules/:categoryAcronym/:moduleName',
  ModuleController.getModuleInfoFromAcronym
);

/*
 * Add module to array route
 */
router.put(
  '/modules/add/:categoryName',
  CategoryController.addModule
)

/*
 * Delete module from array route
 */
router.put(
  '/modules/delete/:categoryName',
  CategoryController.deleteModule
)

module.exports = router
