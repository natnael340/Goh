const express = require('express');
const router = express.Router();
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

const { generate } = require('../component/jwtGenerator')

const userRouter = (user, userLogin) => {
  router.post("/signup", async (req, res) => {
    const email = req.body?.email;
    const password = req.body?.password;
    const emailRegex = /^[a-z0-9]{1,32}\@[a-z]{2,32}\.[a-z]{1,6}$/g
    if (!emailRegex.test(email))
      res.status(400).json({
        message: "Invalid email address"
      })
    else if (!/(?=.*\d).{1,}/g.test(password))
      res.status(400).json({
        message: "Password must contain at least one digit"
      })
    else if (!/(?=.*[!@#$%^&*\(\)\.]).{1,}/g.test(password))
      res.status(400).json({
        message: "Password must contain at least one symbol"
      })
    else if (!/(?=.*[a-zA-Z]).{1,}/g.test(password))
      res.status(400).json({
        message: "Password must contain at least one charcter"
      })
    else if (password.length < 8)
      res.status(400).json({
        message: "Password length must be greater than 8"
      })
    else {
      const oldUser = await userLogin.findOne({where : {
        email
      }})
      if(oldUser){
        return res.status(400).json({
        message: "Email already used"
      })
      }
      const newUser = await userLogin.create({
        email,
        password: bcrypt.hashSync(password, salt)
      });
      res.status(201).json({
        message: "User created Succesfully"
      });
    }
  });
  router.post("/login", async (req, res) => {
    const email = req.body?.email;
    const password = req.body?.password;
    const emailRegex = /^[a-z0-9]{1,32}\@[a-z]{2,32}\.[a-z]{1,6}$/g
    if (emailRegex.test(email)) {
      const pass = await userLogin.findOne({
        where: {
          email: email
        },
        attributes: ['password', 'UserUuid'],
      })
      if (pass && bcrypt.compare(password, pass.password)) {
        if (pass.UserUuid) {
          const token = generate({ uuid: pass.UserUuid })
          res.status(200).json({ message: "user authenticated", code: 740412, token })
        }

        else {
          const token = generate({ email, incomplete: true })
          res.status(200).json({ message: "Registration not complete", code: 447431, token })
        }
      }
      else
        res.status(403).json({ message: "username/email or password incorrect" })
    }
    else if (/^[0-9a-z]$/g.test(email)) {
      const uuid = await user.findOne({
        where: {
          username
        },
        attributes: ['uuid']
      })
      if (uuid) {
        const pass = await userLogin.findOne({
          where: {
            UserUuid: uuid.uuid
          },
          attributes: ['password'],
        })
        if (pass && bcrypt.compare(password, pass.password)) {
          const token = generate({ uuid })
          res.status(200).json({ message: userAuthenticated, code: 740412, token })
        }
        else
          res.status(403).json({ message: "username/email or password incorrect" })
      }
      else
        res.status(403).json({ message: "username/email or password incorrect" })
    }
    else {
      res.status(403).json({ message: "invalid username or email" })
    }
  });
  router.get("/reset_password", async (req, res) => {
    
  });
  return router;
}

module.exports = userRouter