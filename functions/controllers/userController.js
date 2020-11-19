const { admin, db } = require('../utils/firebaseAdmin')
const firebase = require('firebase')
const config = require('../utils/firebaseConfig')
firebase.initializeApp(config)

const functions = require('firebase-functions')
const stripe = require('stripe')(functions.config().stripe_test_secret.key)

//* Validators
const {
  validateLoginData,
  validateRegisterData,
} = require('../utils/validators')

//* @desc    Register a new user / create stripe customer
//* @route   POST /api/users/login
//* @access  Public
exports.registerUser = async (req, res) => {
  //* Construct User with request data
  newUserData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  }
  //* Validate new user data
  const { valid, errors } = validateRegisterData(newUserData)
  if (!valid) {
    return res.status(400).json(errors)
  } else {
    //* Create Stripe Customer
    const newStripeCustomer = await stripe.customers.create({
      name: newUserData.name,
      email: newUserData.email,
      metadata: {
        isAdmin: 'false',
      },
    })
    //* Check for new Stripe Customer
    if (!newStripeCustomer) {
      return res
        .status(400)
        .json({ error: 'Failed to create new stripe customer' })
    } else {
      //* Get Stripe customer ID
      const { id: stripeCustomerId } = newStripeCustomer

      //* Create Firestore User Object
      const newFirestoreUser = {
        name: newUserData.name,
        email: newUserData.email,
        password: newUserData.password,
        confirmPassword: newUserData.confirmPassword,
        stripeCustomerId: stripeCustomerId,
        isAdmin: false,
      }

      //* Create variables to hold token and userId
      let token
      let userId

      //* Check if the user already exists by their email
      db.doc(`/users/${newFirestoreUser.email}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            return res.status(400).json({
              error: 'This email is already associated with an account.',
            })
          } else {
            //* Create a new authenticated user
            return firebase
              .auth()
              .createUserWithEmailAndPassword(
                newFirestoreUser.email,
                newFirestoreUser.password
              )
          }
        })
        .then((data) => {
          //* Set userId and token with data
          userId = data.user.uid
          return data.user.getIdToken()
        })
        .then((idToken) => {
          token = idToken

          //* Create and Set new userCredentials for user in firestore db
          const newUserCredentials = {
            name: newFirestoreUser.name,
            email: newFirestoreUser.email,
            createdAt: new Date().toISOString(),
            isAdmin: false,
            userId,
            stripeCustomerId: newFirestoreUser.stripeCustomerId,
          }
          return db.doc(`/users/${userId}`).set(newUserCredentials)
        })
        .then(() => {
          //* Fetch newly registered user from firestore
          db.collection('users')
            .doc(userId)
            .get()
            .then((userSnapshot) => {
              //* Check if user exists in firestore db
              if (!userSnapshot) {
                return res
                  .status(404)
                  .json({ error: 'Failed to find new user in firestore db' })
              } else {
                //* Deconstruct new user data
                const {
                  email,
                  isAdmin,
                  name,
                  userId,
                  stripeCustomerId,
                } = userSnapshot.data()

                //* Create new user object with token and send in response
                const newUser = {
                  email: email,
                  isAdmin: isAdmin,
                  name: name,
                  userId: userId,
                  stripeCustomerId: stripeCustomerId,
                  token,
                }
                return res.status(201).json(newUser)
              }
            })
        })
        .catch((error) => {
          console.error(error)
          if (error.code === 'auth/email-already-in-use') {
            return res.status(400).json({
              email: 'This email is already associated with an account.',
            })
          } else {
            return res.status(500).json({ error: error.code })
          }
        })
    }
  }
}

//* @desc    Auth/Log in user
//* @route   POST /api/users/login
//* @access  Public
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  }
  const { valid, errors } = validateLoginData(user)
  if (!valid) {
    return res.status(400).json(errors)
  }
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(async (data) => {
      //* Use this to fetch user from firestore
      const userId = data.user.uid
      //* Get token
      data.user
        .getIdToken()
        .then(async (token) => {
          //* Fetch user data from firestore DB
          await db
            .collection('users')
            .doc(userId)
            .get()
            .then((userSnapshot) => {
              const {
                isAdmin,
                email,
                name,
                stripeCustomerId,
              } = userSnapshot.data()
              const userData = {
                userId: userId,
                name: name,
                email: email,
                isAdmin: isAdmin,
                stripeCustomerId: stripeCustomerId,
                token,
              }
              res.status(200).json(userData)
            })
            .catch((error) => {
              console.log(error)
              res
                .status(404)
                .json({ error: 'Failed to fetch user from firestore DB' })
            })
        })
        .catch((error) => {
          console.log(error)
          res.status(400).json({ error: 'Failed to retrieve user token' })
        })
    })
    .catch((error) => {
      console.log(error)
      // If error it's either wrong password or not a valid user
      return res
        .status(403)
        .json({ general: 'Invalid credentials, please try again.' })
    })
}

//* @desc    Initialize forogt password
//* @route   POST /api/users/forgot-password
//* @access  Private
exports.forgotPassword = (req, res) => {
  return firebase
    .auth()
    .sendPasswordResetEmail(req.body.email)
    .then(() =>
      res.status(200).json({
        general:
          'Password reset sent. Check your inbox for further instructions.',
      })
    )
    .catch((error) => {
      console.log(error)
      if (error.code === 'auth/invalid-email') {
        return res
          .status(500)
          .json({ error: 'Email address is invalid. Please try again.' })
      } else if (error.code === 'auth/user-not-found') {
        return res.status(500).json({
          error:
            'There is no user associated with this account. Please try again or contact our support team.',
        })
      } else {
        res.status(500).json(error)
      }
    })
}

//* @desc    Reset user password
//* @route   POST /api/users/password-reset
//* @access  Private
exports.resetUserPassword = (req, res) => {
  // Destructure request object
  const { newPassword, actionCode, lang } = req.body

  //* Set localized langauge
  firebase.auth().languageCode = lang

  //* Verify the password reset code
  firebase
    .auth()
    .verifyPasswordResetCode(actionCode)
    .then(() => {
      // Save the new password.
      firebase
        .auth()
        .confirmPasswordReset(actionCode, newPassword)
        .then(() => {
          //* Password reset has been confirmed and new password updated.
          console.log('Password reset successful!')
          res.status(200).json({
            message: 'Password reset succesful. Please try logging in.',
          })
        })
        .catch(function (error) {
          console.log(error)
          res.status(500).json({
            error:
              'No confirmation, failed to reset password. Please try again.',
          })
        })
    })
    .catch(function (error) {
      console.log(error)
      res.status(500).json({
        error:
          'Invalid action code. Please try again or contact our support team.',
      })
    })
}

// TODO: Everything below here still needs to be worked on
//* @desc    Get all users
//* @route   GET /api/users
//* @access  Private/Admin
exports.getAllUsers = (req, res) => {
  db.collection('users')
    .get()
    .then((data) => {
      let users = []
      data.forEach((doc) => {
        users.push({
          userId: doc.id,
          ...doc.data(),
        })
      })
      return res.json(users)
    })
    .catch((err) => console.error(err))
}

//* @desc    Get user by ID
//* @route   GET /api/users/:id
//* @access  Private/Admin
exports.getUserById = (req, res) => {
  db.doc(`/users/${req.params.id}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let user = doc.data()
        return res.status(200).json(user)
      } else {
        return res.status(404).json({ error: 'User does not exist.' })
      }
    })
    .catch(function (error) {
      console.log('Error fetching user data:', error)
    })
}

//* @desc    Update user profile
//* @route   PUT /api/users/profile
//* @access  Private
exports.updateUserProfile = (req, res) => {
  //* Get the current user info
  const currentUserData = db
    .collection('users')
    .doc(req.body.userId)
    .get()
    .then((snapshot) => {
      return snapshot.data()
    })

  //* Create a reference to user
  const userRef = db.doc(`/users/${req.body.userId}`)

  //* Update user info
  userRef
    .update({
      name: req.body.name ? req.body.name : currentUserData.name,
      email: req.body.email ? req.body.email : currentUserData.email,
      isAdmin: false,
      shipping_address: req.body.shipping_address,
    })
    .then(() => {
      return res.status(201).json({
        statusCode: 201,
        message: 'User profile successfully updated!',
      })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({ error: 'Failed to update user profile' })
    })
}

//* @desc    Update user to Admin
//* @route   PUT /api/users/:id
//* @access  Private/Admin
exports.updateUserToAdmin = (req, res) => {
  const userRef = db.doc(`/users/${req.params.id}`)
  return userRef
    .update({
      isAdmin: true,
    })
    .then(() => {
      res.json({ message: 'User successfully updated to Admin!' })
    })
    .catch(function (error) {
      console.log('Error fetching user data:', error)
    })
}

//* @desc    Delete a user
//* @route   DELETE
//* @access  Private/Admin
exports.deleteUser = (req, res) => {
  db.doc(`/users/${req.params.id}`)
    .delete()
    .then(() => {
      console.log('User successfully deleted')
      res.status(200).json({ message: 'User successfully deleted' })
    })
    .catch((err) => {
      console.log(err)
      res.status(404).json({ error: 'User not found' })
    })

  // var user = firebase.auth().currentUser

  // user
  //   .delete()
  //   .then(() => {
  //     console.log('User successfully deleted')
  //     res.status(200).json({ message: `${user.email} successfully deleted.` })
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //     res.status(500).json({ error: 'Failed to delete user.' })
  //   })
}
