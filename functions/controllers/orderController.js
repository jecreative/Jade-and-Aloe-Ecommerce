const firebaseAdmin = require('../utils/firebaseAdmin')
const { db } = require('../utils/firebaseAdmin')

//* @desc    Get all orders
//* @route   GET /api/orders
//* @access  Private
exports.fetchAllOrders = async (req, res) => {
  // Access firestore database collection
  db.collection('orders')
    .get()
    .then((data) => {
      // return res.json(data)
      let orders = []
      data.forEach((doc) => {
        orders.push({
          orderId: doc.id,
          ...doc.data(),
        })
      })
      return res.json(orders)
    })
    .catch((err) => console.error(err))
}

//* @desc    Create new order
//* @route   POST /api/orders
//* @access  Private
exports.createOrder = async (req, res) => {
  if (req.body.orderId) {
    const currentOrderRef = await db.collection('orders').doc(req.body.orderId)

    currentOrderRef
      .update(req.body)
      .then((response) => {
        return res.json(response)
      })
      .catch((error) => {
        console.log(error)
        res.status(404).json(error)
      })
  }

  try {
    const newOrderRef = db.collection('orders').doc()
    await newOrderRef.set({
      createdAt: new Date().toISOString(),
      orderId: newOrderRef.id,
      customerId: req.body.customerId,
      items_price: req.body.items_price,
      tax_price: req.body.tax_price,
      shipping_price: req.body.shipping_price,
      total_price: req.body.total_price,
      isPaid: false,
      isDelivered: false,
      shippingAddress: '',
      billingAddress: '',
      payment_method: '',
      order_items: req.body.orderItems,
    })

    const order = db.collection('orders').doc(newOrderRef.id)

    await order
      .get()
      .then((snapshot) => {
        return res.status(201).json(snapshot.data())
      })
      .catch((error) => {
        console.log(error)
        return res
          .status(404)
          .json({ statusCode: 404, error: 'Failed to find new order' })
      })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create new order' })
  }
  y
}

//* @desc    Update order by ID
//* @route   PUT /api/orders/:id
//* @access  Private
exports.updateOrder = async (req, res) => {
  //* Get current order data
  const currentOrderData = await db
    .collection('orders')
    .doc(req.params.id)
    .get()
    .then((snapshot) => {
      return snapshot.data()
    })
    .catch((error) => {
      console.log(error)
      return res
        .status(404)
        .json({ statusCode: 404, error: 'Failed to find order to be updated' })
    })

  const updatedOrder = {
    customerId: req.body.customerId
      ? req.body.customerId
      : currentOrderData.customerId,
    items_price: req.body.items_price
      ? req.body.items_price
      : currentOrderData.items_price,
    tax_price: req.body.tax_price
      ? req.body.tax_price
      : currentOrderData.tax_price,
    shipping_price: req.body.shipping_price
      ? req.body.shipping_price
      : currentOrderData.shipping_price,
    total_price: req.body.total_price
      ? req.body.total_price
      : currentOrderData.total_price,
    isPaid: req.body.isDelivered
      ? req.body.isDelivered
      : currentOrderData.isPaid,
    isDelivered: req.body.isDelivered
      ? req.body.isDelivered
      : currentOrderData.isDelivered,
    shippingAddress: req.body.shippingAddress
      ? req.body.shippingAddress
      : currentOrderData.shippingAddress,
    billing_address: req.body.billing_address
      ? req.body.billing_address
      : currentOrderData.billing_address,
    payment_method: req.body.payment_method
      ? req.body.payment_method
      : currentOrderData.payment_method,
    orderItems: req.body.orderItems
      ? req.body.orderItems
      : currentOrderData.order_items,
  }
  const orderRef = db.collection('orders').doc(req.params.id)
  await orderRef
    .update(updatedOrder)
    .then((response) => {
      //* Returns a success response
      if (!response) {
        return res.status(500).json({
          error: 'Order update failed. Success response not recieved.',
        })
      }
      //* Fetch updated product from firestore DB
      db.collection('orders')
        .doc(req.params.id)
        .get()
        .then((docSnapshot) => {
          return res.status(200).json(docSnapshot.data())
        })
        .catch((error) => {
          console.log(error)
          return res.stats(404).json({
            error: 'Updated order not found',
          })
        })
    })
    .catch((error) => {
      console.log(error)
      return res.status(400).json({
        error: 'Failed to updated order in firestore DB',
      })
    })
}

//* @desc    Get users orders
//* @route   GET /api/orders/:id
//* @access  Private
exports.getOrders = async (req, res) => {
  const ordersRef = db.collection('orders')
  const snapshot = await ordersRef
    .where('stripeCustomerId', '==', req.body.stripeCusomterId)
    .get()
  if (snapshot.empty) {
    return res.status(404).json({ message: 'Snapshot is empty' })
  }

  stripeData = []
  snapshot.forEach((doc) => {
    stripeData.push(doc.data())
  })
  return res.status(200).json(stripeData)
}

//* @desc    Get order by ID
//* @route   GET /api/orders/:id
//* @access  Private
exports.fetchOrderById = async (req, res) => {
  db.collection('orders')
    .doc(req.params.id)
    .get()
    .then((doc) => {
      return res.status(200).json(doc.data())
    })
    .catch((error) => {
      console.log(error)
      return res
        .status(404)
        .json({ error: 'Failed to retrieve order from firestore db' })
    })
}

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private

//! Look into payment notifications through Stripe

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private
