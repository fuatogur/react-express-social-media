const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  title: String,
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Like'}],
  replies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reply'}],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Post', postSchema)
