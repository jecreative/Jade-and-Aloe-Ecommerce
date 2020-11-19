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
router.route('/').get(fetchAllOrders).post(createOrder)
router.route('/:id').get(fetchOrderById).put(updateOrder)
router.route('/myorders').post(fetchUserOrders)

module.exports = router
