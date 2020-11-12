const { admin, db } = require('../utils/firebaseAdmin')

// Authorized Users with Token
module.exports.auth = (req, res, next) => {
  let idToken
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1]
  } else {
    console.error('Invalid credentials. Authoirzation token required.')
    return res.status(403).json({ error: 'Unauthorized, token is required.' })
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken
      return db
        .collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get()
    })
    .then((data) => {
      req.user = data.docs[0].data()
      // Add Request for image url
      return next()
    })
    .catch((err) => {
      console.error('Error verifying authorization token', err)
      return res.status(403).json(err)
    })
}
