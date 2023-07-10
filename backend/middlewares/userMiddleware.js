const jwt = require('jsonwebtoken')
const helpers = require('../helpers')

module.exports = function (req, res, next) {
  const token = helpers.getBearerToken(req)

  if (token != null) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) req.user = user
    })
  }

  next()
}
