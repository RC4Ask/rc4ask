const UniversityController = require('../controllers/universities')
const ModuleController = require('../controllers/modules')
const express = require('express')
const router = express.Router()

/*
 * Get particular university info
 */
router.get(
  '/:uniAcronym',
  UniversityController.getUniInfoAcronym
)

/*
 * Get particular university info
 */
router.get(
  '/name/:uniName',
  UniversityController.getUniInfoName
)

/*
 * Creates a university
 */
router.post(
  '/add',
  UniversityController.createUni
)

/*
 * Deletes a university
 */
router.delete(
  '/delete',
  UniversityController.deleteUni
)

/*
 * Retrieves all modules in that university
 */
router.get(
  '/modules/:uniName',
  UniversityController.getModuleList
);

/*
 * Get module info from acronym and module name
 */
router.get(
  '/modules/:uniAcronym/:moduleName',
  ModuleController.getModuleInfoFromAcronym
);

/*
 * Add module to array route
 */
router.put(
  '/modules/add/:uniName',
  UniversityController.addModule
)

/*
 * Delete module from array route
 */
router.put(
  '/modules/delete/:uniName',
  UniversityController.deleteModule
)

module.exports = router
