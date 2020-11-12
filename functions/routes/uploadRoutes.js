const express = require('express')
const router = express.Router()

// Controllers
const {
  uploadImageToFirebaseStorage,
} = require('../controllers/uploadController')

// Middleware
const { admin } = require('../middleware/adminMiddleware')
const { auth } = require('../middleware/authMiddleware')

// User Routes
router.route('/').post(auth, admin, uploadImageToFirebaseStorage)

module.exports = router
