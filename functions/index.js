// Firebase
const functions = require('firebase-functions')
const { admin, db } = require('./utils/firebaseAdmin')

// Express
const express = require('express')
const app = express()
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js')

// CORS
const cors = require('cors')
app.use(cors())

// Routes
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

// Express Router Middleware
app.use(notFound)
app.use(errorHandler)

// BaseUrl /api/...
exports.api = functions.https.onRequest(app)

/*
Cloud Functions / Triggers

onCreate	Triggered when a document is written to for the first time.
onUpdate	Triggered when a document already exists and has any value changed.
onDelete()	Triggered when a document with data is deleted.
onWrite	Triggered when onCreate, onUpdate or onDelete is triggered.     
*/

// Listen for changes in all documents in the 'users' collection.
// When a user is deleted from the Firestore collection 'users'
// it will also be removed from Authentication
exports.onUserDelete = functions.firestore
  .document('users/{uid}')
  .onDelete((snapshot, context) => {
    return admin
      .auth()
      .deleteUser(context.params.uid)
      .then(() => {
        console.log('User removed from authenticated panel')
      })
      .catch((err) => {
        console.error(err)
        return
      })
  })
