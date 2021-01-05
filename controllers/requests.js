const Request = require('../models/Request')
const User = require('../models/User')

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

/* Finds request by category and module*/
const findRequestByUniAndMod = async (uni, mod) => {
  return new Promise((resolve, reject) => {
    Request.findOne({ category: uni, module: mod })
      .select('_id category module counter')
      .then(request => {
        resolve(request)
      })
      .catch(err => reject(buildErrObject(422, err.message)));
  });
};

/* Deletes request from database */
const deleteRequestFromDb = async (id) => {
  return new Promise((resolve, reject) => {
    Request.deleteOne({ _id: id })
    .then(result => {
      if (result.n) resolve(buildSuccObject('Request deleted'));
      else reject(buildErrObject(422, 'Request not found'));
    })
    .catch(error => handleError(res, buildErrObject(422, error.message)));
  })
}

/* Returns all requests sorted from date */
const sortedRequest = async () => {
  return new Promise((resolve, reject) => {
    Request.find()
    .sort({ date: 1 })
    .lean()
    .then(requestList => {
      resolve(requestList)
    })
    .catch(err => reject(buildErrObject(422, err.message)));
  })
}

/********************
 * Public functions *
 ********************/

exports.createRequest = async (req, res) => {
   try {
    const uni = req.body.category
    const mod = req.body.module
    const userId = req.body._id
    const existingRequest = await findRequestByUniAndMod(uni, mod)
    if (existingRequest) {
      if (existingRequest.counter.indexOf(userId) > -1) {
        handleError(res, buildErrObject(422, "User already made this request"));
      } else {
        existingRequest.counter.push(userId)
        existingRequest.save()
        handleSuccess(res, buildSuccObject(existingRequest))
        return
      }
    } else {
      var newRequest = new Request({
        category: uni,
        module: mod,
        date: Date.now()
      })
      
      newRequest.counter.push(userId)
      newRequest
      .save()
      .then(request =>
        handleSuccess(res, buildSuccObject(request))
      )
      .catch(error => handleError(res, buildErrObject(422, error.message)));
    }
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}

exports.deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId
    await deleteRequestFromDb(requestId)

    handleSuccess(res, buildSuccObject("Request deleted!"))
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}

exports.cancelRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId
    const userId = req.body._id

    const request = await findRequestById(requestId)
    const temp = []
    request.counter.forEach(element => {
      if (element != userId) {
        temp.push(element)
      }
    })

    if (temp.length < 1) {
      await deleteRequestFromDb(requestId)
      handleSuccess(res, buildSuccObject("Request deleted from DB"))
    } else {
      request.counter = temp
      request.save()
      .then(request =>
        handleSuccess(res, buildSuccObject(request))
      )
      .catch(error => handleError(res, buildErrObject(422, error.message)));
    }
  
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}

exports.getAllRequest = async (req, res) => {
  try {
    const requestList = await sortedRequest()

    handleSuccess(res, buildSuccObject(requestList))
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}
