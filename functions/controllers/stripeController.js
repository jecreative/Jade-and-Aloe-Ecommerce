const functions = require('firebase-functions')
const stripe = require('stripe')(functions.config().stripe_secret.key)

//* @desc    Stripe Checkout
//* @type    POST /api/stripe
//* @access  Private
exports.stripeCheckout = async (req, res) => {
  //* Get Customer Id and items in order
  const { stripeCustomerId, line_items } = req.body

  try {
    //* Init Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      line_items: line_items,
      mode: 'payment',
      success_url:
        'http://localhost:3000/checkout/success?id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cart',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      billing_address_collection: 'required',
    })

    res.status(200).json({ id: session.id })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

//* @desc    Retrieve Stripe session data by Id
//* @type    GET /stripe/session/:id
//* @access  Private
exports.getCheckoutSessionData = async (req, res) => {
  try {
    const sessionData = await stripe.checkout.sessions.retrieve(req.query.id, {
      expand: ['line_items'],
    })
    res.status(200).json(sessionData)
  } catch (error) {
    console.log(error)
    res
      .status(404)
      .json({ error: 'Failed to retrieve session data by stripe session id.' })
  }
}

//* @desc    Custom Checkflow Flow with Stripe
//* @type    POST /api/stripe/charge
//* @access  TODO: Private
exports.stripeCharge = async (req, res) => {
  const { id, amount } = req.body

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      description: 'Testing description',
      payment_method: id,
      confirm: true,
    })

    return res.status(200).json(payment)
  } catch (error) {
    console.log(error)
    return res.status(400).json({ message: error.raw.message })
  }
}
