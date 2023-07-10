const User = require('../models/user')
const Conversation = require('../models/conversation')
const Message = require('../models/message')
const pusher = require('../pusher')

async function getConversations(req, res) {
  const {slug} = req.query

  if (slug) {
    const user = await User.findOne({slug})

    if (user) {
      const conversationByUser = await Conversation.findOne({
        members: {$all: [user._id, req.user._id]}
      })

      if (!conversationByUser) {
        await Conversation.create({
          members: [user._id, req.user._id]
        })
      }
    }
  }

  const conversations = await Conversation.find({
    members: req.user._id
  }, {}, {
    sort: {lastMessageCreatedAt: -1}
  }).populate('members')

  return res.json(conversations)
}

async function createMessage(req, res) {
  const {slug, message} = req.body

  const user = await User.findOne({slug})
  const userId = user._id

  let conversation = await Conversation.findOne({
    members: {$all: [req.user._id, userId]}
  })

  if (!conversation) {
    conversation = await Conversation.create({
      members: [req.user._id, userId]
    })
  }

  const insertedMessage = await Message.create({
    conversation,
    user: req.user._id,
    message
  })

  conversation.lastMessageCreatedAt = new Date()
  await conversation.save()

  await pusher.trigger('user_' + userId, 'chat', {
    type: 'new'
  })

  res.json({
    success: {
      message: 'Success'
    }
  })
}

async function getMessages(req, res) {
  const {slug} = req.query

  const user = await User.findOne({slug})

  if (!user) {
    res.json({
      error: 'not-found'
    })
    return
  }

  const userId = user._id

  const conversation = await Conversation.findOne({
    members: {$all: [req.user._id, userId]}
  })

  const messages = await Message.find({
    conversation
  }).populate('user')

  return res.json(messages)
}

module.exports = {
  getConversations,
  createMessage,
  getMessages
}
