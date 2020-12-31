const UniversityController = require('../controllers/universities')
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
  UniversityController.getUniInfoAcronym
)

/*
 * Get particular university info
 */
router.get(
  '/name/:categoryName',
  UniversityController.getUniInfoName
)

/*
 * Creates a university
 */
router.post(
  '/add',
  AuthController.verifyToken,
  auth.roleAuthorization(['admin', 'superadmin']),
  UniversityController.createUni
)

/*
 * Deletes a university
 */
router.delete(
  '/delete',
  AuthController.verifyToken,
  auth.roleAuthorization(['admin', 'superadmin']),
  UniversityController.deleteUni
)

/*
 * Retrieves all modules in that university
 */
router.get(
  '/modules/:categoryName',
  UniversityController.getModuleList
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
  UniversityController.addModule
)

/*
 * Delete module from array route
 */
router.put(
  '/modules/delete/:categoryName',
  UniversityController.deleteModule
)

module.exports = router
