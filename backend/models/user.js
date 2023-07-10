const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  slug: String,
  firstName: String,
  lastName: String,
  company: String,
  email: String,
  phone: String,
  avatar: {
    type: String,
    default: null
  },
  instagram: String,
  about: String,
  password: {
    type: String,
    select: false
  },
  interests: [
    {name: String}
  ],
  education: [
    {name: String, date: Date}
  ],
  experiences: [
    {name: String, date: Date}
  ],
  skills: [
    {name: String}
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('User', userSchema)
