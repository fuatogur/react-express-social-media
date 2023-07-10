module.exports = function (req, res, next) {
  if (!req.user) return res.sendStatus(403)

  next()
}
