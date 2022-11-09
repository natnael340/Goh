const jwt = require('jsonwebtoken');

const generate = (data) => {
  console.log(data)
  return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1800s' })
}
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.status(403).json({message: "Login first"})

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(req.originalUrl == "/api/v1/user/complete_registration")
    if (err) return res.status(403).json({message: "invalid/expired token"})

    if(user?.incomplete && req.originalUrl != "/api/v1/user/complete_registration")
      return res.status(401).json({message: "Compelete the registration", code: 11254})
    req.user = user

    next()
  })
}

module.exports = {generate, authenticate}