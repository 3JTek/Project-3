const User = require('../models/user')
const jwt = require('jsonwebtoken')

function registerRoute(req, res) {
  User.create(req.body)
    .then(() => res.status(201).json({ message: 'Registration Completed '}))
    .catch((err) => res.status(422).json(err.errors))
}

function loginRoute(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user || !user.validatePassword(req.body.password)) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const payload = { sub: user._id, admin: user.admin }
      const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '6h'})
      res.json({
        token,
        message: `Welcome back ${user.username}!`
      })
    })
}

module.exports = {
  register: registerRoute,
  login: loginRoute
}
