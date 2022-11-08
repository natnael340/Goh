const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const userRouter = require('./routes/user');

app.use(bodyParser.json())

const port = 8080
const db = require('./models/models.js')
const { user, userLogin } = db.init();

router = userRouter(user, userLogin);

app.get('/', async (req, res) => {
  const users = await userLogin.findAll();
  res.json(users)
})
app.use('/api/v1/user', router)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})