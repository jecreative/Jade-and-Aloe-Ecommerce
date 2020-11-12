const express = require('express')
const router = express.Router()

// Controllers
const {
  login,
  registerUser,
  getAllUsers,
  getUserById,
  updateUserToAdmin,
  deleteUser,
  updateUserProfile,
  forgotPassword,
  resetUserPassword,
} = require('../controllers/userController')

// Middleware
const { admin } = require('../middleware/adminMiddleware')
const { auth } = require('../middleware/authMiddleware')

// User Routes
router.route('/').post(registerUser).get(auth, admin, getAllUsers)
router
  .route('/:id')
  .get(auth, admin, getUserById)
  .put(auth, admin, updateUserToAdmin)
  .delete(auth, admin, deleteUser)
router.post('/login', login)
router.route('/profile').put(updateUserProfile)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetUserPassword)

module.exports = router
