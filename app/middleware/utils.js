const mongoose = require('mongoose')

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
  // Prints error in console
  if (process.env.NODE_ENV === 'development') {
  }
  // Sends error to user
  res.status(err.code).json({
    errors: {
      msg: err.message
    }
  })
}

/**
 * Handles success by printing to console in development env and builds and sends a success response
 * @param {Object} res - response object
 * @param {Object} obj - success object
 */
exports.handleSuccess = (res, obj) => {
  // Prints obj in console
  if (process.env.NODE_ENV === 'development') {
    console.log(obj);
  }
  // Sends obj to user
  res.status(200).json(obj);
};

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => {
  return {
    code,
    message
  }
}

/**
 * Builds success object
 * @param {string} message - success text
 */
exports.buildSuccObject = (message) => {
  return message
}
