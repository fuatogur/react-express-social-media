const User = require('../models/user')
const Connection = require('../models/connection')
const Notification = require('../models/notification')
const pusher = require('../pusher')
const {getConnectionsIds} = require('../helpers')

async function createConnection(req, res) {
  const {userId} = req.body

  if (userId === req.user._id) return res.sendStatus(400)

  const currentUser = await User.findById(req.user._id)
  const connectionUser = await User.findById(userId)
  if (!currentUser || !connectionUser) return res.sendStatus(400)

  const hasConnection = await Connection.findOne({
    user: currentUser,
    connection: connectionUser
  })

  if (hasConnection) {
    res.json({
      error: 'You already have a connection request to this user'
    })
    return
  }

  let connection = await Connection.findOne({
    user: connectionUser,
    connection: currentUser
  })

  if (connection) {
    connection.status = 1
    await connection.save()

    await Notification.findOneAndRemove(
      {type: 'connection', typeId: connection._id}
    )
  } else {
    connection = await Connection.create({
      user: currentUser,
      connection: connectionUser
    })

    await Notification.create({
      user: connectionUser,
      type: 'connection',
      typeId: connection._id,
      title: `${currentUser.company ? currentUser.company : `${currentUser.firstName} ${currentUser.lastName}`} wants to have a connection with you`
    })

    await pusher.trigger('user_' + connectionUser._id, 'notification', 'you got a notification')
  }

  res.json({
    success: {
      message: 'Successful'
    }
  })
}

async function changeConnectionStatus(req, res) {
  const {status} = req.body
  const userId = req.body.userId

  let connection
  if (req.body.userId) {
    connection = await Connection.findOne({
      user: userId,
      connection: req.user._id
    })
  } else {
    connection = await Connection.findById(req.body.connectionId)
  }

  if (!connection || connection.connection != req.user._id) return res.sendStatus(400)

  const connectionId = connection._id

  if (status === false) {
    await Connection.findOneAndRemove({_id: connectionId})
  } else {
    const connection = await Connection.findById(connectionId)
    connection.status = true
    await connection.save()
  }

  await Notification.findOneAndRemove(
    {type: 'connection', typeId: connectionId}
  )

  res.json({
    success: {
      message: 'Successful'
    }
  })
}

async function getConnections(req, res) {
  const ids = await getConnectionsIds(req)

  const users = await User.find({
    _id: {$in: ids}
  })

  res.json(users)
}

async function getConnection(req, res) {
  const {userId} = req.query

  const connection = await Connection.findOne({
    $or: [
      {user: userId, connection: req.user._id},
      {connection: userId, user: req.user._id}
    ]
  })

  if (!connection) {
    res.json({
      success: {
        status: 'not_connected'
      }
    })
    return
  }

  if (connection.status === true) {
    res.json({
      success: {
        status: 'connected'
      }
    })
    return
  }

  if (connection.user == req.user._id) {
    res.json({
      success: {
        status: 'requested'
      }
    })
    return
  }

  // connection.connection == req.user._id
  res.json({
    success: {
      status: 'pending_request'
    }
  })
}

async function removeConnection(req, res) {
  const {userId} = req.body

  const connection = await Connection.findOne({
    $or: [
      {user: userId, connection: req.user._id},
      {connection: userId, user: req.user._id}
    ]
  })

  if (!connection) return res.sendStatus(400)

  await Connection.findOneAndRemove({_id: connection._id})

  res.json({
    success: {
      message: 'Success'
    }
  })
}

module.exports = {
  createConnection,
  changeConnectionStatus,
  getConnections,
  getConnection,
  removeConnection
}
