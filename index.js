const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const houseRouter = require('./routes/houses');

const corsConfig = {
  credentials: true,
  origin: "https://tubbyneighboringfact.natnaeltilahun2.repl.co",
}

app.use(cors(corsConfig))
app.use(bodyParser.json())

const port = 8080
const db = require('./models/models.js')
const { user, userLogin, houses, favHouse } = db.init();

const auth = authRouter(user, userLogin);
const userRoute = userRouter(user, userLogin);
const houseRoute = houseRouter(houses, favHouse);

app.get('/', async (req, res) => {
  const newUser = await user.create({username: "malik", firstName: "malik", lastName: "malik", middleName: "malik"})
  const userl = await userLogin.create({UserUuid: newUser.uuid, email: "malik147@gmail.com", password: bcrypt.hashSync("malik147@gmail.com", salt)})
  const users = await user.findAll();
  res.json(users)
})
app.use('/api/v1/auth', auth)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/house', houseRoute)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})