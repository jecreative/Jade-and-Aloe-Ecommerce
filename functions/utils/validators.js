// Check for valid email
const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email.match(regEx)) return true
  else return false
}

// Check if required fields are empty
const isEmpty = (string) => {
  if (string === undefined || string.trim() === '') {
    return true
  } else {
    return false
  }
}

// Validation for Login
exports.validateLoginData = (data) => {
  let errors = {}

  if (isEmpty(data.email)) {
    errors.email = 'Email must not be empty.'
  }

  if (isEmpty(data.password)) {
    errors.password = 'Password must not be empty.'
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  }
}

// Validation for register
exports.validateRegisterData = (data) => {
  let errors = {}

  if (isEmpty(data.name)) {
    errors.name = 'Name is required'
  }

  if (isEmpty(data.email)) {
    errors.email = 'Email is required'
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address'
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty'
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match'

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  }
}
