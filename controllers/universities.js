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

/* Finds university by name  */
const findUniversityByName = async (name) => {
  return new Promise((resolve, reject) => {
    Category.findOne({ acronym: name })
      .then((uni) => {
        if (!uni) {
          reject(buildErrObject(422, 'Category does not exist'));
        } else {
          resolve(uni); // returns mongoose object
        }
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/********************
 * Public functions *
 ********************/

exports.getUniInfoAcronym = async (req, res) => {
  Category.findOne({ acronym: req.params.uniAcronym })
    .lean()
    .then((uni) => {
      if (uni) handleSuccess(res, buildSuccObject(uni));
      else handleError(res, buildErrObject(422, 'Category not found'));
    })
    .catch((err) => handleError(res, buildErrObject(422, err.message)));
};

exports.getUniInfoName = async (req, res) => {
  Category.findOne({ name: req.params.uniName })
    .lean()
    .then((uni) => {
      if (uni) handleSuccess(res, buildSuccObject(uni));
      else handleError(res, buildErrObject(422, 'Category not found'));
    })
    .catch((err) => handleError(res, buildErrObject(422, err.message)));
};

exports.getModuleList = async (req, res) => {
  try {
    const uni = await findUniversityByName(req.params.uniName);
    Module.find({ category: uni._id })
      .select(
        '_id name title description posts followers category uniAcronym'
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

exports.createUni = async (req, res) => {
  var newUni = new Category({
    name: req.body.category.name,
    acronym: req.body.category.acronym,
    overview: req.body.category.overview,
    website: req.body.category.website,
    logo: req.body.category.logo,
  });

  newUni
    .save()
    .then((uni) =>
      handleSuccess(res, buildSuccObject('New category created'))
    )
    .catch((error) => handleError(res, buildErrObject(422, error.message)));
};

exports.deleteUni = async (req, res) => {
  Category.deleteOne({ _id: req.body.uniId })
    .then((result) => {
      if (result.n) handleSuccess(res, buildSuccObject('Category deleted'));
      else handleError(res, buildErrObject(422, 'Category not found'));
    })
    .catch((error) => handleError(res, buildErrObject(422, error.message)));
};

exports.updateUni = async (req, res) => {
  Category.updateOne({ _id: req.params.uniId }, req.body.category)
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
    const uni = await findUniversityByName(req.params.uniName);
    const moduleId = req.body.moduleId;
    if (!uni) {
      handleError(res, buildErrObject(409, 'Category not found'));
      return;
    }

    if (uni.modules.indexOf(moduleId) === -1) {
      uni.modules.push(moduleId);
    } else {
      handleError(res, buildErrObject(422, 'Module already exists'));
      return;
    }

    uni.save();
    handleSuccess(res, buildSuccObject('Module added to ' + uni.name));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const uni = await findUniversityByName(req.params.uniName);
    const moduleId = req.body.moduleId;
    const uni_idx = uni.modules.indexOf(moduleId);
    if (uni_idx > -1) {
      const temp = [];
      uni.modules.forEach((element) => {
        if (element != moduleId) {
          temp.push(element);
        }
      });
      uni.modules = temp;
    } else {
      handleError(
        res,
        buildErrObject(422, 'Module does not belong to ' + uni.name)
      );
      return;
    }

    uni.save();
    handleSuccess(res, buildSuccObject('Module removed from ' + uni.name));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};
