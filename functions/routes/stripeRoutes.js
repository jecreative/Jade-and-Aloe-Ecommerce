const express = require('express')
const router = express.Router()

//* Controllers
const {
  stripeCheckout,
  getCheckoutSessionData,
  stripeCharge,
} = require('../controllers/stripeController')

//* Middleware
const { admin } = require('../middleware/adminMiddleware')
const { auth } = require('../middleware/authMiddleware')

//* Stripe Routes
//TODO: Add auth for protection to both routes

router.route('/').post(stripeCheckout)
router.route('/session').get(auth, admin, getCheckoutSessionData)
router.route('/charge').post(stripeCharge)

module.exports = router
