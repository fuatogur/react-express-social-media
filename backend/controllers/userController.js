const User = require('../models/user')
const Notification = require('../models/notification')
const Connection = require('../models/connection')
const pusher = require('../pusher')
const {generateJWT} = require('../helpers')
const path = require('path')
const fs = require('fs')

async function updateUserData(req, res) {
  const user = await User.findOneAndUpdate({_id: req.user._id}, req.body)

  res.json({
    success: {
      message: 'Your information updated successfully',
      token: generateJWT(user)
    }
  })
}

async function changeAvatar(req, res) {
  const name = Date.now() + req.file.originalname

  const tempPath = req.file.path
  const targetPath = path.join(__dirname, '../public/avatars/' + name)

  const ext = path.extname(req.file.originalname).toLowerCase()

  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    return res.json({
      error: 'Only png jpg and jpeg are allowed'
    })
  }

  fs.rename(tempPath, targetPath, async err => {
    if (err) return res.json({
      error: 'An error occurred'
    })

    const user = await User.findOneAndUpdate({_id: req.user._id}, {avatar: name})

    res.json({
      success: {
        message: 'Your information updated successfully',
        token: generateJWT(user)
      }
    })
  })
}

async function notifications(req, res) {
  const notifications = await Notification.find({
    user: req.user._id
  }).lean()

  for (let i = 0; i < notifications.length; i++) {
    if (notifications[i].type === 'connection') {
      const connection = await Connection.findById(notifications[i].typeId)

      if (connection) {
        notifications[i].connectionUser = await User.findById(connection.user == req.user._id ? connection.connection : connection.user)
      }
    }
  }

  res.json(notifications)
}

async function hasNotification(req, res) {
  const notification = await Notification.findOne({
    user: req.user._id
  })

  res.json(notification != null)
}

async function getUsers(req, res) {
  const {name} = req.query

  let users

  if (name) {
    users = await User.aggregate([
      {
        $addFields: {nameSurname: {$concat: ['$firstName', ' ', '$lastName']}}
      },
      {
        $match: {
          $or: [
            {nameSurname: new RegExp(name, 'i')},
            {company: new RegExp(name, 'i')}
          ]
        }
      }
    ])
  } else {
    users = await User.find()
  }

  res.json(users)
}

async function getUser(req, res) {
  const {slug} = req.query

  const user = await User.findOne({slug})

  res.json(user)
}

async function pusherUserAuth(req, res) {
  const socketId = req.body.socket_id

  const user = await User.findById(req.user._id).lean()

  const authResponse = pusher.authenticateUser(socketId, user)
  res.send(authResponse)
}

async function pusherAuth(req, res) {
  const socketId = req.body.socket_id
  const channel = req.body.channel_name

  const authResponse = pusher.authorizeChannel(socketId, channel)
  res.send(authResponse)
}

module.exports = {
  updateUserData,
  changeAvatar,
  notifications,
  hasNotification,
  getUser,
  getUsers
}
