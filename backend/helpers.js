const jwt = require('jsonwebtoken')
const Connection = require('./models/connection')

function generateJWT(user) {
  return jwt.sign(serializeUser(user), process.env.JWT_SECRET, {expiresIn: '30d'})
}

function getBearerToken(req) {
  return req.headers['authorization']?.slice(7)
}

function serializeUser(user) {
  const {_id, slug, firstName, lastName, avatar, company, email, phone, instagram, about, createdAt} = user

  return {
    _id,
    slug,
    firstName,
    lastName,
    avatar,
    company,
    email,
    phone,
    instagram,
    about,
    createdAt
  }
}

async function getConnectionsIds(req) {
  const connections = await Connection.find({
    status: true,
    $or: [
      {user: req.user._id},
      {connection: req.user._id}
    ]
  })

  return connections.map(connection => {
    return connection.user == req.user._id ? connection.connection : connection.user
  })
}

module.exports = {
  generateJWT,
  getBearerToken,
  serializeUser,
  getConnectionsIds
}
