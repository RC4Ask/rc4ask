const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Profile = require('../models/Profile')
const Post = require('../models/Post')
const auth = require('../middleware/auth')
const avatar = require('../middleware/avatar')
const { addHours } = require('date-fns')
const uuid = require('uuid')
const UserMailer = require('../mailers/user_mailer')

const {
  handleError,
  handleSuccess,
  buildErrObject,
  buildSuccObject,
  itemNotFound
} = require('../middleware/utils');
const HOURS_TO_BLOCK = 2
const LOGIN_ATTEMPTS = 5

/*********************
 * Private functions *
 *********************/

 /**
 * Generates a token
 * @param {Object} user - user object
 */
const generateToken = (user) => {
  // Gets expiration time
  const expiration =
    Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRATION_IN_MINUTES
  // returns signed and encrypted token
  return auth.encrypt(
    jwt.sign(
      {
        data: {
          _id: user
        },
        exp: expiration
      },
      process.env.JWT_SECRET
    )
  )
}

/**
 * Creates an object with user info
 * @param {Object} req - request object
 */
const setUserInfo = (req) => {
  let user = {
    _id: req._id,
    name: req.name,
    email: req.email,
    role: req.role,
    verified: req.verified,
    avatar: req.avatar
  }
  // Adds verification for testing purposes
  if (process.env.NODE_ENV !== 'production') {
    user = {
      ...user,
      verification: req.verification
    }
  }
  return user
}

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async (user) => {
  return new Promise((resolve, reject) => {
    user.save((err, result) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      if (result) {
        resolve(true)
      }
    })
  })
}

const createProfile = async (credentials) => {
  return new Promise ((resolve, reject) => {
    const profile = new Profile({
      user: credentials._id,
      name: credentials.name,
      avatar: credentials.avatar,
      dateJoined: Date.now()
    })

    profile.save((err, item) => {
      if (err) reject(buildErrObject(422, err.message))
      resolve(item)
    })
  })
}
/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = async (req) => {
  return new Promise((resolve, reject) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      verification: uuid.v4()
    }); 

    user.avatar = avatar.generateAvatarUrl(user.name)

    user.save((err, item) => {
      if (err) reject(buildErrObject(422, err.message))
      resolve(item)
    });
  });
};

/* Checks User model if user with a specific email exists */
const isEmailRegistered = async email => {
  return new Promise((resolve, reject) => {
    User.findOne({ email }, (err, item) => {
      if (err) reject(buildErrObject(422, err.message));
      if (item) resolve(true);
      else resolve(false);
    });
  });
}

/**
 * Checks if blockExpires from user is greater than now
 * @param {Object} user - user object
 */
const userIsBlocked = async (user) => {
  return new Promise((resolve, reject) => {
    if (user.blockExpires > new Date()) {
      reject(buildErrObject(409, 'User is blocked. Please try again after ' + user.blockExpires))
    }
    resolve(true)
  })
}

/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
    user.save((err, result) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      if (result) {
        resolve(buildErrObject(409, 'User is blocked. Please try again after ' + user.blockExpires))
      }
    })
  })
}

/* Finds user by email  */
const findVerifiedUserByEmail = async email => {
  return new Promise((resolve, reject) => {
    User.findOne({ email })
      .select('password loginAttempts blockExpires name email role verified verification')
      .then(user => {
        if (!user) {
          reject(buildErrObject(422, 'Email is not registered'));
        } else {
          resolve(user); // returns mongoose object
        }
      })
      .catch(err => reject(buildErrObject(422, err.message)));
  });
};

/**
 * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS, if is less returns wrong password, else returns blockUser function
 * @param {Object} user - user object
 */
const passwordsDoNotMatch = async (user) => {
  user.loginAttempts += 1
  await saveLoginAttemptsToDB(user)
  return new Promise((resolve, reject) => {
    if (user.loginAttempts <= LOGIN_ATTEMPTS) {
      resolve(buildErrObject(409, 'Invalid credentials'))
    } else {
      resolve(blockUser(user))
    }
    reject(buildErrObject(422, 'ERROR'))
  })
}

/* Builds the registration token
* @param {Object} item - user object that contains created id
* @param {Object} userInfo - user object
*/
const returnRegisterToken = (item, userInfo) => {
 if (process.env.NODE_ENV !== 'production') {
   userInfo.verification = item.verification
 }
 const data = {
   token: generateToken(item._id),
   user: userInfo
 }
 return data
}

const updatePassword = async (user, newPassword) => {
  return new Promise((resolve, reject) => {
    user.password = newPassword;
    user.save((err, item) => {
      if (err) reject(buildErrObject(422, err.message));
      if (!item) reject(buildErrObject(422, 'User not found'));
      resolve(item);
    });
  });
};

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = async (token) => {
  return new Promise((resolve, reject) => {
    // Decrypts, verifies and decode token
    jwt.verify(auth.decrypt(token), process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(buildErrObject(409, 'BAD_TOKEN'))
      }
      resolve(decoded.data._id)
    })
  })
}

/* Invalidates a token */
const invalidateToken = async user => {
  return new Promise((resolve, reject) => {
    user.accessToken = null;
    user.accessTokenExpiry = null;

    user.refreshToken = null;
    user.refreshTokenExpiry = null;

    user.save((err, item) => {
      if (err) reject(buildErrObject(422, err.message));
      resolve(item);
    });
  });
};

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId, (err, item) => {
      itemNotFound(err, item, reject, 'USER_DOES_NOT_EXIST')
      resolve(item)
    })
  })
}

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const verifyUser = async (user) => {
  return new Promise((resolve, reject) => {
    user.verified = true
    user.save((err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

/* Finds post by id*/
const findPostById = async (id) => {
  return new Promise((resolve, reject) => {
    Post.findOne({ _id: id })
      .select('_id text title module author moduleName authorName upvote downvote comments avatar categoryName categoryAcronym nOfUpvote')
      .then(post => {
        if (!post) {
          reject(buildErrObject(422, 'Post does not exist'));
        } else {
          resolve(post); // returns mongoose object
        }
      })
      .catch(err => reject(buildErrObject(422, err.message)));
  });
};

/********************
 * Public functions *
 ********************/
/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.register = async (req, res) => {
  try {
    if (await isEmailRegistered(req.body.email)) {
      handleError(res, buildErrObject(409, 'Email is already registered'));
      return;
    }

    const user = await registerUser(req)
    const userInfo = setUserInfo(user)
    await createProfile(userInfo)
    const responseToken = returnRegisterToken(user, userInfo)
    UserMailer.verifyRegistration(responseToken)
      .then((info, response) => {
        handleSuccess(
          res,
          buildSuccObject(responseToken)
        );
      })
      .catch(err => handleError(res, buildErrObject(422, err.message)));
  } catch (error) {
    handleError(res, buildErrObject(422, error.message));
  }
}

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.login = async (req, res) => {
  try {
    const data = req.body
    const user = await findVerifiedUserByEmail(data.email)
    await userIsBlocked(user)
    const isPasswordMatch = await auth.checkPassword(data.password, user)
    if (!isPasswordMatch) {
      handleError(res, await passwordsDoNotMatch(user))
    } else {
      // all ok, register access and return token
      user.loginAttempts = 0
      await saveLoginAttemptsToDB(user)
      const token = generateToken(user._id)
      if (user.verified) {
        handleSuccess(
          res,
          buildSuccObject({
            user: {
              name: user.name,
              initials: user.name[0],
              email: user.email,
              role: user.role,
              verified: user.verified
            },
            token
          })
        );
      } else {
        const responseToken = {
          user,
          token
        }
        
        UserMailer.verifyRegistration(responseToken)
        .then((info, response) => {
          handleSuccess(
            res,
            buildSuccObject(responseToken)
          );
        })
        .catch(err => handleError(res, buildErrObject(422, err.message)));
      }
    }
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}

/* Signout called by route */
exports.logout = async (req, res) => {
  try {
    await invalidateToken(user);
    handleSuccess(res, buildSuccObject('User logged out'));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getUserFromToken = async (req, res) => {
  try {
    var tokenEncrypted = req.headers.authorization
    if (tokenEncrypted) {
      tokenEncrypted = tokenEncrypted.replace('Bearer ', '').trim()
      let userId = await getUserIdFromToken(tokenEncrypted)
      const user = await findUserById(userId)
      res.status(200).json(user)
    } else {
      handleError(res, buildErrObject(409, 'No token available'))
      return
    }
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}

/* Verifies token validity */
exports.verifyToken = async (req, res, next) => {
  try {
    var tokenEncrypted = req.headers.authorization
    if (tokenEncrypted) {
      tokenEncrypted = tokenEncrypted.replace('Bearer ', '').trim()
      let userId = await getUserIdFromToken(tokenEncrypted)
      req.body._id = userId
      return next()
    } else {
      handleError(res, buildErrObject(409, 'No token available'))
      return
    }
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.verify = async (req, res) => {
  try {
    const userId = await getUserIdFromToken(req.params.token)
    let user = await findUserById(userId)

    user = await verifyUser(user)
    handleSuccess(res, buildSuccObject({
      user,
      token: req.params.token
    }))
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  } 
}

/**
 * Sends forgot password request function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.sendForgotPassword = async (req, res) => {
  try {
    const data = req.body
    const user = await findVerifiedUserByEmail(data.email)
    const token = generateToken(user._id)
    
    UserMailer.forgotPassword(user, token)
    .then((info, response) => {
      handleSuccess(
        res,
        buildSuccObject("Email sent to " + data.email)
      )
    })
    .catch(err => handleError(res, buildErrObject(422, err.message)))
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token
    const userId = await getUserIdFromToken(token)
    let user = await findUserById(userId)

    await updatePassword(user, req.body.user.newPassword)
    handleSuccess(res, buildSuccObject('Password updated!'));
  } catch (err) {
  handleError(res, buildErrObject(422, err.message));
  }
}

exports.verifyUserIdentityForComment = async (req, res, next) => {
  try {
    var tokenEncrypted = req.headers.authorization
    if (tokenEncrypted) {
      tokenEncrypted = tokenEncrypted.replace('Bearer ', '').trim()
      let userId = await getUserIdFromToken(tokenEncrypted)
      const post = await findPostById(req.params.postId)
      const comment = post.comments.find(element => element._id == req.params.commentId)
      if (comment) {
        if (comment.author == userId) {
          return next()
        } else {
          handleError(res, buildErrObject(409, 'User not authorized to delete this comment'))
        }
      } else {
        handleError(res, buildErrObject(409, 'Comment not found'))
      }
    } else {
      handleError(res, buildErrObject(409, 'No token available'))
      return
    }
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}

exports.verifyUserIdentityForPost = async (req, res, next) => {
  try {
    var tokenEncrypted = req.headers.authorization
    if (tokenEncrypted) {
      tokenEncrypted = tokenEncrypted.replace('Bearer ', '').trim()
      let userId = await getUserIdFromToken(tokenEncrypted)
      const post = await findPostById(req.params.postId)
      if (post.author == userId) {
        return next()
      } else {
        handleError(res, buildErrObject(409, 'User not authorized to delete this post'))
      }
    } else {
      handleError(res, buildErrObject(409, 'No token available'))
      return
    }
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
}
