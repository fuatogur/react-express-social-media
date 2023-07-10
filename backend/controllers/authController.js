const slugify = require('slugify')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')
const {generateJWT} = require('../helpers')

async function register(req, res) {
  const {firstName, lastName, company, username, email, password} = req.body

  const user = await User.findOne({email}).select('+password')

  if (user) {
    res.json({
      error: 'Email already in use'
    })
    return
  }

  const slug = slugify(username)

  if (slug !== username || await User.findOne({slug})) {
    res.json({
      error: 'Please select a different username'
    })
    return
  }

  const salt = bcryptjs.genSaltSync(10)
  const passwordHash = bcryptjs.hashSync(password, salt)

  const insertedUser = await User.create({
    firstName,
    lastName,
    company,
    email,
    password: passwordHash,
    slug,
    phone: '',
    instagram: '',
    about: '',
    interests: [],
    education: [],
    experiences: [],
    skills: [],
    notifications: []
  })

  const token = generateJWT(insertedUser)

  res.json({
    success: {
      message: 'Successfully signed up',
      token
    }
  })
}

async function login(req, res) {
  const {email, password} = req.body

  const user = await User.findOne({email}).select('+password')

  if (!user) {
    res.json({
      error: 'Email or password is incorrect'
    })
    return
  }

  if (!bcryptjs.compareSync(password, user.password)) {
    res.json({
      error: 'Email or password is incorrect'
    })
    return
  }

  const token = generateJWT(user)

  res.json({
    success: {
      message: 'Successfully logged in',
      token
    }
  })
}

module.exports = {
  register,
  login
}
