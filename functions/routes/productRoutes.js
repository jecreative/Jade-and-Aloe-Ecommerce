const express = require('express')
const router = express.Router()

// Controllers
const {
  fetchAllProducts,
  createProduct,
  fetchSingleProduct,
  updateProduct,
} = require('../controllers/productController')

// Middleware
const { admin } = require('../middleware/adminMiddleware')
const { auth } = require('../middleware/authMiddleware')

// Product Routes
router.route('/').get(fetchAllProducts).post(auth, admin, createProduct)
router.route('/:id').get(fetchSingleProduct).put(updateProduct)

module.exports = router
