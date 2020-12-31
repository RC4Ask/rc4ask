const Module = require('../models/Module');
const Post = require('../models/Post');
const Category = require('../models/Category');
const Request = require('../models/Request');
const User = require('../models/User');

const axios = require('axios');

const notif = require('../middleware/notification');
const {
  handleError,
  handleSuccess,
  buildErrObject,
  buildSuccObject,
} = require('../middleware/utils');

/*********************
 * Private functions *
 *********************/

/* Finds module by Id */
const findModuleyById = async (id) => {
  return new Promise((resolve, reject) => {
    Module.findOne({ _id: id })
      .select(
        '_id name title description posts followers category categoryAcronym'
      )
      .then((mod) => {
        if (!mod) {
          reject(buildErrObject(422, 'Module does not exist'));
        } else {
          resolve(mod); // returns mongoose object
        }
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/* Finds module by Id */
const findModuleyByName = async (name, uni) => {
  return new Promise((resolve, reject) => {
    Module.findOne({ name: name, category: uni })
      .select(
        '_id name title description posts followers category categoryAcronym'
      )
      .then((mod) => {
        resolve(mod);
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/* Finds user by id  */
const findUserById = async (id) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: id })
      .select('name email role verified _id following avatar notifications')
      .then((user) => {
        if (!user) {
          reject(buildErrObject(422, 'User does not exist'));
        } else {
          resolve(user); // returns mongoose object
        }
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/**
 * Finds user by ID
 * @param {string} id - post's id
 */
const findPostById = async (postId) => {
  return new Promise((resolve, reject) => {
    Post.findOne({ _id: postId })
      .then((post) => {
        if (!post) {
          reject(buildErrObject(422, 'Post does not exist'));
        } else {
          resolve(post); // returns mongoose object
        }
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/**
 * Finds university by ID
 * @param {string} id - universitiy's id
 */
const findUniversityById = async (uniId) => {
  return new Promise((resolve, reject) => {
    Category.findOne({ _id: uniId })
      .select('_id name acronym modules')
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

/**
 * Finds university by acronym
 * @param {string} id - universitiy's id
 */
const findUniversityByAcronym = async (acronym) => {
  return new Promise((resolve, reject) => {
    Category.findOne({ acronym: acronym })
      .select('_id name modules')
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

/* Returns all modules sorted from followers */
const sortedModule = async () => {
  return new Promise((resolve, reject) => {
    Module.find()
      .sort({ nOfFollowers: -1 })
      .lean()
      .then((moduleList) => {
        resolve(moduleList);
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/* Finds request by id*/
const findRequestById = async (id) => {
  return new Promise((resolve, reject) => {
    Request.findOne({ _id: id })
      .select('_id category module counter')
      .then((request) => {
        if (!request) {
          reject(buildErrObject(422, 'Request does not exist'));
        } else {
          resolve(request); // returns mongoose object
        }
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/********************
 * Public functions *
 ********************/

exports.getPostList = async (req, res) => {
  try {
    const temp = [];
    const mod = await findModuleyById(req.params.moduleId);
    for (const element of mod.posts) {
      const post = await findPostById(element);
      temp.push(post);
    }

    handleSuccess(res, buildSuccObject(temp));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.createModule = async (req, res) => {
  try {
    const request = await findRequestById(req.body.request);
    const admin = req.body._id;
    var newModule = new Module({
      name: req.body.module.name,
      title: req.body.module.title,
      description: req.body.module.description,
      category: req.body.module.category,
      nOfFollowers: 0,
    });

    const data = {
      type: 'request',
      action: newModule._id,
    };

    for (const element of request.counter) {
      const user = await findUserById(element);
      notif.createNotification(data, user, admin);
    }

    const uni = await findUniversityById(newModule.category);
    const checkMod = await findModuleyByName(newModule.name, uni._id);
    if (checkMod) {
      handleError(res, buildErrObject(422, 'Module already exists!'));
      return;
    }

    newModule.categoryAcronym = uni.acronym;
    uni.modules.push(newModule._id);

    uni.save();
    newModule
      .save()
      .then((mod) => handleSuccess(res, buildSuccObject('New module created')))
      .catch((error) => handleError(res, buildErrObject(422, error.message)));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.deleteModule = async (req, res) => {
  Module.deleteOne({ _id: req.body.moduleId })
    .then((result) => {
      if (result.n) handleSuccess(res, buildSuccObject('Module deleted'));
      else handleError(res, buildErrObject(422, 'Module not found'));
    })
    .catch((error) => handleError(res, buildErrObject(422, error.message)));
};

exports.getModuleInfo = async (req, res) => {
  try {
    let mod = await findModuleyById(req.params.moduleId);
    const uni = await findUniversityById(mod.category);

    mod = {
      ...mod._doc,
      acronym: uni.acronym,
    };

    handleSuccess(res, buildSuccObject(mod));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.getModuleInfoFromAcronym = async (req, res) => {
  try {
    const uni = await findUniversityByAcronym(req.params.categoryAcronym);
    const temp = [];
    for (i = 0; i < uni.modules.length; i++) {
      const mod = await findModuleyById(uni.modules[i]);
      temp.push(mod);
    }

    const mod = temp.find((element) => element.name == req.params.moduleName);
    handleSuccess(res, buildSuccObject(mod));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.getModuleList = async (req, res) => {
  Module.find()
    .lean()
    .then((moduleList) => handleSuccess(res, buildSuccObject(moduleList)))
    .catch((err) => handleError(res, buildErrObject(422, err.message)));
};

exports.addPost = async (req, res) => {
  try {
    const mod = await findModuleyById(req.params.moduleId);
    const postId = req.body.postId;

    if (mod.posts.indexOf(postId) === -1) {
      mod.posts.push(postId);
    } else {
      handleError(
        res,
        buildErrObject(422, 'Post already inside module ' + mod.name)
      );
      return;
    }

    mod.save();
    handleSuccess(
      res,
      buildSuccObject('Post successfully added to ' + mod.name)
    );
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.deletePost = async (req, res) => {
  try {
    const mod = await findModuleyById(req.params.moduleId);
    const postId = req.body.postId;

    const post_idx = mod.posts.indexOf(postId);

    if (post_idx > -1) {
      const temp = [];
      mod.posts.forEach((element) => {
        if (element != postId) {
          temp.push(element);
        }
      });
      mod.posts = temp;
    } else {
      handleError(
        res,
        buildErrObject(422, 'Post does not belong to ' + mod.name)
      );
      return;
    }

    mod.save();
    handleSuccess(res, buildSuccObject('Module removed from ' + mod.name));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.giveModuleRecommendations = async (req, res) => {
  try {
    const moduleList = await sortedModule();
    const temp = [];
    for (i = 0; i < 3; i++) {
      temp.push(moduleList[i]);
    }

    handleSuccess(res, buildSuccObject(temp));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.getModuleFromNUSMODS = async (req, res) => {
  try {
    const url =
      'https://api.nusmods.com/v2/2019-2020/modules/' +
      req.params.moduleName +
      '.json';
    axios
      .get(url)
      .then((response) => {
        if (response) {
          handleSuccess(res, buildSuccObject(response.data));
        }
        handleError(res, buildErrObject('Module not found!'));
      })
      .catch((err) => {
        handleError(res, buildErrObject(err.message));
      });
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};
