const express = require('express')
const router = express.Router()

// Load Auth route
router.use('/users', require('./user'))

// Load Categories route
router.use('/categorylist', require('./categorylist'))

// Load University route
router.use('/categories', require('./categories'));

// Load Module route
router.use('/modules', require('./module'));

// Load Post route
router.use('/posts', require('./post'));

// Load Profile route
router.use('/profiles', require('./profile'))

// Load Request route
router.use('/requests', require('./request'))

// Load Contribution route
router.use('/contributions', require('./contribution'))

// Load Filter route
router.use('/filters', require('./filter'))

// Load Notification route
router.use('/notifications', require('./notification'))

module.exports = router
