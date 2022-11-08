const express = require('express');
const router = express.Router();

const userRouter = (user, userLogin) => {
  router.post("/signup", (req, res) => {
    const email = req.body?.email;
    const password = req.body?.password;
    const emailRegex = /^[a-z0-9]{1,32}\@[a-z]{2,32}\.[a-z]{1,6}$/g
    if(!emailRegex.test(email))
      res.status(400).json({message: "Invalid email address"})
    else if(!/(?=.*\d).{1,}/g.test(password))
      res.status(400).json({message: "Password must contain at least one digit"})
    else if(!/(?=.*[!@#$%^&*\(\)\.]).{1,}/g.test(password))
      res.status(400).json({message: "Password must contain at least one symbol"})
    else if(!/(?=.*[a-zA-Z]).{1,}/g.test(password))
      res.status(400).json({message: "Password must contain at least one charcter"})
    else if(password.length <8)
      res.status(400).json({message: "Password length must be greater than 8"})
    else
      res.status(200).json({email, password})
});
  return router;
}

module.exports = userRouter