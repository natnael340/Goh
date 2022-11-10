const express = require('express');
const router = express.Router();

const { generate, authenticate } = require('../component/jwtGenerator')

const userRouter = (user, userLogin) => {
  router.post("/complete_registration", authenticate, async (req, res) => {
    const firstName = req.body?.fname;
    const middleName = req.body?.mname;
    const lastName = req.body?.lname;
    const username = req.body?.username;
    
    if (!/^[0-9a-z]{3,32}$/g.test(username))
      return res.status(400).json({
        message: "Invalid username"
      })
    else if (!/^[a-zA-Z]{2,}$/g.test(firstName))
      return res.status(400).json({
        message: "Invalid first name"
      })
    else if (!/^[a-zA-Z]{0,}$/g.test(lastName))
      return res.status(400).json({
        message: "Invalid last name"
      })
    else if (!/^[a-zA-Z]{2,}$/g.test(middleName))
      return res.status(400).json({
        message: "Invalid middle name"
      })
    else {
      const oldUser = await user.findOne({where: {
        username
      }})
      if(oldUser){
        return res.status(400).json({
        message: "Username taken"
      })
      }
      const newUser = await user.create({
        firstName,
        middleName,
        lastName,
        username
      });
      await userLogin.update({ UserUuid: newUser.uuid }, {
        where: {
          email: req.user.email
        }
      });
      const token = generate({ uuid: newUser.uuid })
      res.status(201).json({
        message: "User profile completed",
        token
      });
    }
  });
  router.get("/info", authenticate, async (req, res) => {
    const info = await user.findOne({
      include: { model: userLogin, required: true }, where: {
        uuid: req.user.uuid
      }
    })
    return res.status(200).json(info)
  });
  return router;
}

module.exports = userRouter