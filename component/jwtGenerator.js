const jwt = require('jsonwebtoken');

const generate = (data) => {
  return jwt.sign(data, process.env.TOKEN_SECRET, '1800s')
}
const authehticate = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.status(401).json({message: "Login first"})

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    console.log(err)
    if (err) return res.status(403).json({message: "invalid/expired token"})

    if(user?.incomplete)
      return res.status(200).json({message: "Compelete the registration"})
    req.user = user

    next()
  })
}