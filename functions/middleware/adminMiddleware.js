const { admin, db } = require('../utils/firebaseAdmin')

// Admin Middelware
module.exports.admin = async (req, res, next) => {
  const idToken = req.headers.authorization.split(' ')[1]
  // idToken comes from the client app
  const userId = await admin
    .auth()
    .verifyIdToken(idToken)
    .then(function (decodedToken) {
      let uid = decodedToken.uid
      return uid
    })
    .catch(function (error) {
      console.log(error)
    })

  const userRef = await db.collection('users').doc(userId).get()

  if (userRef.data().isAdmin === true) {
    next()
  } else {
    console.error('Unauthorized access. Admin only')
    return res.status(403).json({ error: 'Unauthorized access. Admin only' })
  }
}
