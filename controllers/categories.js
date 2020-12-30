const Category = require('../models/Category')
const Module = require('../models/Module')
const User = require('../models/User')

const notif = require('../middleware/notification')
const {
  handleError,
  handleSuccess,
  buildErrObject,
  buildSuccObject
} = require('../middleware/utils');

/*********************
 * Private functions *
 *********************/

 /* Finds request by id*/
const findRequestById = async (id) => {
  return new Promise((resolve, reject) => {
    Request.findOne({ _id: id })
      .select('_id category module counter')
      .then(request => {
        if (!request) {
          reject(buildErrObject(422, 'Request does not exist'));
        } else {
          resolve(request); // returns mongoose object
        }
      })
      .catch(err => reject(buildErrObject(422, err.message)));
  });
};

/* Finds user by id  */
const findUserById = async id => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: id })
      .select('name email role verified _id following avatar notifications')
      .then(user => {
        if (!user) {
          reject(buildErrObject(422, 'User does not exist'));
        } else {
          resolve(user); // returns mongoose object
        }
      })
      .catch(err => reject(buildErrObject(422, err.message)));
  });
};

/********************
 * Public functions *
 ********************/

exports.getUniversityList = async (req, res) => {
  Category.find()
    .select('name modules acronym').sort({name: 1})
    .lean()
    .then(universityList => handleSuccess(res, buildSuccObject(universityList)))
    .catch(err => handleError(res, buildErrObject(422, err.message)));
};

exports.createUniAndModule = async (req, res) => {
  try {
    const request = await findRequestById(req.body.request)
    const admin = req.body._id

    var newUni = new Category({
      name: req.body.category.name,
      acronym: req.body.category.acronym,
      overview: req.body.category.overview,
      website: req.body.category.website,
      logo: req.body.category.logo,
    });

    var newModule = new Module({
      name: req.body.module.name,
      title: req.body.module.title,
      description: req.body.module.description,
      category: newUni._id,
      nOfFollowers: 0
    });
    
    const data = {
      type: 'request',
      action: newModule._id
    }

    for (const element of request.counter) {
      const user = await findUserById(element) 
      notif.createNotification(data, user, admin)
    }

    newModule.uniAcronym = newUni.acronym
    newUni.modules.push(newModule._id)
    newUni.save()
    newModule.save()
    handleSuccess(res, buildSuccObject('Category and Module created'))
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}
