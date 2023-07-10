require('dotenv').config()

const userMiddleware = require('./middlewares/userMiddleware')
const authMiddleware = require('./middlewares/authMiddleware')
const {register, login} = require('./controllers/authController')
const {
  updateUserData,
  changeAvatar,
  notifications,
  hasNotification,
  getUser,
  getUsers
} = require('./controllers/userController')
const {
  createPost,
  getPosts,
  removePost,
  likePost,
  createReply,
  removeReply,
  getReplies
} = require('./controllers/postController')
const {createJob, removeJob, getJobs} = require('./controllers/jobController')
const {
  createConnection,
  changeConnectionStatus,
  getConnections,
  getConnection,
  removeConnection
} = require('./controllers/connectionController')
const {getConversations, createMessage, getMessages} = require('./controllers/chatController')

const express = require('express')
const multer = require('multer')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const app = express()
const port = 3001

mongoose.connect(process.env.MONGO_URI)

app.use(express.json())
app.use(cors())
app.use(userMiddleware)
app.use(express.static('public'))

const upload = multer({
  dest: path.join(__dirname, 'temp')
})

app.post('/api/register', register)
app.post('/api/login', login)
app.post('/api/updateUserData', authMiddleware, updateUserData)
app.post('/api/changeAvatar', authMiddleware, upload.single('file'), changeAvatar)
app.get('/api/notifications', authMiddleware, notifications)
app.get('/api/hasNotification', authMiddleware, hasNotification)
app.get('/api/user', getUser)
app.get('/api/users', getUsers)
app.post('/api/posts', authMiddleware, createPost)
app.get('/api/posts', authMiddleware, getPosts)
app.post('/api/removePost', authMiddleware, removePost)
app.post('/api/likePost', authMiddleware, likePost)
app.post('/api/replies', authMiddleware, createReply)
app.get('/api/replies', authMiddleware, getReplies)
app.post('/api/removeReply', authMiddleware, removeReply)
app.post('/api/jobs', authMiddleware, createJob)
app.post('/api/removeJob', authMiddleware, removeJob)
app.get('/api/jobs', authMiddleware, getJobs)
app.post('/api/connections', authMiddleware, createConnection)
app.get('/api/connections', authMiddleware, getConnections)
app.get('/api/connection', authMiddleware, getConnection)
app.post('/api/changeConnectionStatus', authMiddleware, changeConnectionStatus)
app.post('/api/removeConnection', authMiddleware, removeConnection)
app.get('/api/conversations', authMiddleware, getConversations)
app.post('/api/messages', authMiddleware, createMessage)
app.get('/api/messages', authMiddleware, getMessages)

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})

module.exports = app
