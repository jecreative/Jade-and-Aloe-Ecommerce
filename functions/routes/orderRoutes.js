const express = require('express')
const router = express.Router()

//* Controllers
const {
  createOrder,
  fetchAllOrders,
  fetchOrderById,
  fetchUserOrders,
  updateOrder,
} = require('../controllers/orderController')

//* Middleware
const { admin } = require('../middleware/adminMiddleware')
const { auth } = require('../middleware/authMiddleware')

//* Order Routes
router.route('/').post(auth, createOrder)
router.route('/list').get(admin, auth, fetchAllOrders)
router.route('/:id').get(auth, fetchOrderById).put(admin, auth, updateOrder)
router.route('/myorders').post(auth, fetchUserOrders)

module.exports = router
