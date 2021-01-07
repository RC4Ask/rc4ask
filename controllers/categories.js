const Category = require('../models/Category');
const Module = require('../models/Module');

const {
  handleError,
  handleSuccess,
  buildErrObject,
  buildSuccObject,
} = require('../middleware/utils');

/*********************
 * Private functions *
 *********************/

/* Finds category by name  */
const findCategoryByName = async (name) => {
  return new Promise((resolve, reject) => {
    Category.findOne({ acronym: name })
      .then((category) => {
        if (!category) {
          reject(buildErrObject(422, 'Category does not exist'));
        } else {
          resolve(category); // returns mongoose object
        }
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/********************
 * Public functions *
 ********************/

exports.getCategoryInfoAcronym = async (req, res) => {
  Category.findOne({ acronym: req.params.categoryAcronym })
    .lean()
    .then((category) => {
      if (category) handleSuccess(res, buildSuccObject(category));
      else handleError(res, buildErrObject(422, 'Category not found'));
    })
    .catch((err) => handleError(res, buildErrObject(422, err.message)));
};

exports.getCategoryInfoName = async (req, res) => {
  Category.findOne({ name: req.params.categoryName })
    .lean()
    .then((category) => {
      if (category) handleSuccess(res, buildSuccObject(category));
      else handleError(res, buildErrObject(422, 'Category not found'));
    })
    .catch((err) => handleError(res, buildErrObject(422, err.message)));
};

exports.getModuleList = async (req, res) => {
  try {
    const category = await findCategoryByName(req.params.categoryName);
    Module.find({ category: category._id })
      .select(
        '_id name title description posts followers category categoryAcronym logo'
      )
      .sort({ name: 1 })
      .lean()
      .then((moduleList) => {
        handleSuccess(res, buildSuccObject(moduleList));
      })
      .catch((err) => handleError(res, buildErrObject(422, err.message)));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.createCategory = async (req, res) => {
  var newCategory = new Category({
    name: req.body.name,
    acronym: req.body.acronym,
    overview: req.body.overview,
    website: req.body.website,
    logo: req.body.logo,
  });

  newCategory
    .save()
    .then((category) =>
      handleSuccess(res, buildSuccObject('New category created'))
    )
    .catch((error) => handleError(res, buildErrObject(422, error.message)));
};

exports.deleteCategory = async (req, res) => {
  Category.deleteOne({ _id: req.body.categoryId })
    .then((result) => {
      if (result.n) handleSuccess(res, buildSuccObject('Category deleted'));
      else handleError(res, buildErrObject(422, 'Category not found'));
    })
    .catch((error) => handleError(res, buildErrObject(422, error.message)));
};

exports.updateCategory = async (req, res) => {
  Category.updateOne({ _id: req.params.categoryId }, req.body.category)
    .then((result) => {
      if (result.n) {
        if (result.nModified)
          handleSuccess(res, buildSuccObject('Category updated'));
        else handleError(res, buildErrObject(422, 'No changes made'));
      } else handleError(res, buildErrObject(422, 'Category not found'));
    })
    .catch((error) => handleError(res, buildErrObject(422, error.message)));
};

exports.addModule = async (req, res) => {
  try {
    const category = await findCategoryByName(req.params.categoryName);
    const moduleId = req.body.moduleId;
    if (!category) {
      handleError(res, buildErrObject(409, 'Category not found'));
      return;
    }

    if (category.modules.indexOf(moduleId) === -1) {
      category.modules.push(moduleId);
    } else {
      handleError(res, buildErrObject(422, 'Module already exists'));
      return;
    }

    category.save();
    handleSuccess(res, buildSuccObject('Module added to ' + category.name));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const category = await findCategoryByName(req.params.categoryName);
    const moduleId = req.body.moduleId;
    const category_idx = category.modules.indexOf(moduleId);
    if (category_idx > -1) {
      const temp = [];
      category.modules.forEach((element) => {
        if (element != moduleId) {
          temp.push(element);
        }
      });
      category.modules = temp;
    } else {
      handleError(
        res,
        buildErrObject(422, 'Module does not belong to ' + category.name)
      );
      return;
    }

    category.save();
    handleSuccess(res, buildSuccObject('Module removed from ' + category.name));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};
