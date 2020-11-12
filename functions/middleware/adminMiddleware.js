const { admin, db } = require('../utils/firebaseAdmin')

// Admin Middelware
module.exports.admin = (req, res, next) => {
  if (req.user.isAdmin === true) {
    next()
  } else {
    console.error('Unauthorized access. Admin only')
    return res.status(403).json({ error: 'Unauthorized access. Admin only' })
  }
}
