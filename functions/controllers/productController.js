const { db } = require('../utils/firebaseAdmin')
const functions = require('firebase-functions')
const stripe = require('stripe')(functions.config().stripe_secret_test.key)

//* @desc    Fetch all products
//* @type    GET /api/products
//* @access  Public
exports.fetchAllProducts = (req, res) => {
  // Access firestore database collection
  db.collection('products')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let products = []
      data.forEach((doc) => {
        products.push({
          productId: doc.id,
          ...doc.data(),
        })
      })
      return res.json(products)
    })
    .catch((err) => console.error(err))
}

//* @desc    Fetch product by firestore ID
//* @type    GET /products/:id
//* @access  Private
exports.fetchSingleProduct = async (req, res) => {
  //* Fetch product from Firestore
  const productDocument = db.collection('products').doc(req.params.id)
  //* Return product object from firestore db
  await productDocument
    .get()
    .then(async (firestoreProduct) => {
      //* Check to make sure product obj exists
      if (!firestoreProduct.exists) {
        res.status(500).json({ error: 'Product not found' })
      }

      const {
        price,
        stripeProductId,
        name,
        description,
        brand,
        stripePriceId,
        createdAt,
        numReviews,
        countInStock,
        rating,
        images,
      } = firestoreProduct.data()

      await stripe.products
        .retrieve(stripeProductId)
        .then((stripeProduct) => {
          console.log('Stripe product ', stripeProduct)

          const { active } = stripeProduct

          product = {
            price: price,
            productId: req.params.id,
            stripeProductId: stripeProductId,
            name: name,
            description: description,
            brand: brand,
            stripePriceId: stripePriceId,
            createdAt: createdAt,
            numReviews: numReviews,
            countInStock: countInStock,
            rating: rating,
            active: active,
            images: images,
          }

          res.json(product)
        })
        .catch((error) => {
          res.status(404).json({ error: error })
        })
    })
    .catch((error) => {
      console.log(error)
      res
        .status(500)
        .json({ error: 'Failed to fetch product from firestore' }, error)
    })
}

//* @desc    Create a product
//* @type    POST /products
//* @access  Private/Admin
exports.createProduct = async (req, res) => {
  await stripe.products
    .create({
      name: req.body.name,
      description: req.body.description,
      active: true,
      type: 'good',
      metadata: {
        brand: req.body.brand,
        countInStock: req.body.countInStock,
        numReviews: req.body.numReviews,
        rating: req.body.rating,
      },
    })
    .then(async (product) => {
      const {
        id: productId,
        name,
        description,
        active,
        metadata: { brand },
      } = product

      //* Returns a price
      const price = await stripe.prices.create({
        unit_amount: req.body.unit_amount,
        currency: 'usd',
        product: productId,
      })

      const { id: priceId, unit_amount } = price

      //* Create new product
      const newProduct = {
        stripeProductId: productId,
        stripePriceId: priceId,
        active: active,
        name: name,
        brand: brand,
        description: description,
        images: req.body.images,
        price: unit_amount / 100,
        countInStock: req.body.countInStock,
        numReviews: req.body.numReviews,
        rating: req.body.rating,
        createdAt: new Date().toISOString(),
      }

      //* Add Product to Firestore Database
      db.collection('products')
        .add(newProduct)
        .then((doc) => {
          res.json({ message: `document ${doc.id} created.` })
        })
        .catch((error) => {
          res.status(500).json({ error: 'Failed to create new product' })
          console.error(error)
        })
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to create new product' })
      console.error(error)
    })
}

//* @desc Update product by ID
//* @type PUT
//* @access Private/Admin
exports.updateProduct = async (req, res) => {
  //* Get product from firestore db
  await db
    .collection('products')
    .doc(req.params.id)
    .get()
    .then(async (doc) => {
      //* Returns a document snapshot
      const firestoreProduct = doc.data()
      if (!firestoreProduct) {
        res.status(500).json({ error: 'Failed to find Firestore product' })
      }
      const { stripeProductId, stripePriceId } = firestoreProduct

      //* Set current product price in stripe to false (inactive)
      await stripe.prices
        .update(stripePriceId, { active: false })
        .then(() => {
          console.log('Successfully set stripe price to false')
        })
        .catch((error) => {
          console.log(error)
          res
            .stauts(400)
            .json({ error: 'Failed to update stripe price to inactive' })
        })

      await stripe.prices
        .create({
          unit_amount: req.body.price,
          currency: 'usd',
          product: stripeProductId,
        })
        .then(async (newStripePrice) => {
          console.log(newStripePrice)
          const {
            id: updatedStripePriceId,
            product: stripeProductId,
            unit_amount,
          } = newStripePrice

          //* Update stripe product
          await stripe.products
            .update(stripeProductId, {
              name: req.body.name,
              description: req.body.description,
              active: req.body.active,
              metadata: {
                brand: req.body.brand,
                countInStock: req.body.countInStock,
                numReviews: req.body.numReviews,
                rating: req.body.rating,
              },
            })
            .then(async (updatedStripeProduct) => {
              //* Returns an updated stripe product object
              const {
                id,
                active,
                name,
                description,
                metadata: { brand, countInStock, numReviews, rating },
              } = updatedStripeProduct

              //* Update product in firestore
              const updateFirestoreProduct = db
                .collection('products')
                .doc(req.params.id)
              await updateFirestoreProduct
                .update({
                  active: active,
                  name: name,
                  brand: brand,
                  description: description,
                  countInStock: countInStock,
                  price: unit_amount / 100,
                  images: req.body.images,
                  rating: rating,
                  numReviews: numReviews,
                  stripeProductId: id,
                  stripePriceId: updatedStripePriceId,
                })
                .then((response) => {
                  //* Returns a success response
                  if (!response) {
                    res
                      .status(500)
                      .json({ error: 'Error no success update response' })
                  }

                  //* Fetch updated product from firestore DB
                  db.collection('products')
                    .doc(req.params.id)
                    .get()
                    .then((updatedProduct) => {
                      res.status(200).json(updatedProduct.data())
                    })
                    .catch((error) => {
                      console.log(error)
                      res.stats(404).json({
                        error: 'Updated product not found in firestore DB',
                      })
                    })
                })
                .catch((error) => {
                  console.log(error)
                  res.status(400).json({
                    error: 'Failed to updated product in firestore DB',
                  })
                })
            })
            .catch((error) => {
              console.log(error)
              res.status(400).json({ error: 'Failed to update stripe product' })
            })
        })
        .catch((error) => {
          console.log(error)
          res.status(400).json({ error: 'Failed to create new stripe price' })
        })
    })
    .catch((error) => {
      console.log(error)
      res.status(404).json({ error: 'Failed to find firestore product!' })
    })
}
