//* Firebase
const functions = require('firebase-functions')
const { admin, db } = require('./utils/firebaseAdmin')

//* Express
const express = require('express')
const app = express()
app.use(express.json())
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js')

//* CORS
const cors = require('cors')
app.use(cors())

//* Routes
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const stripeRoutes = require('./routes/stripeRoutes')
const orderRoutes = require('./routes/orderRoutes')

app.use('/products', productRoutes)
app.use('/users', userRoutes)
app.use('/uploads', uploadRoutes)
app.use('/stripe', stripeRoutes)
app.use('/orders', orderRoutes)

//* Express Router Middleware
app.use(notFound)
app.use(errorHandler)

//* BaseUrl /api/...
exports.api = functions.https.onRequest(app)
