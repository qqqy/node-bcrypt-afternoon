require('dotenv').config();
const express = require('express')
const session = require('express-session')
const massive = require('massive')
const { SERVER_PORT , CONNECTION_STRING , SESSION_SECRET } = process.env
const ca = require('./controllers/authController')
const treasureController = require('./controllers/treasureController')
const app = express()
const auth = require('./middleware/authmiddleware')

app.use(express.json())
app.use(session({
  secret: SESSION_SECRET , 
  resave: true ,
  saveUninitialized: false
}))

// TESTING ENDPOINTS //

app.get('/api/test' , (req , res) => res.sendStatus(200))

// FUNCTIONAL ENDPOINTS //

app.post('/auth/register' , ca.register)
app.post('/auth/login' , ca.login)
app.get('/auth/logout' , ca.logout)
app.get('/api/treasure/dragon' , treasureController.dragonTreasure)
app.get('/api/treasure/user' , auth.usersOnly , treasureController.getUserTreasure)
app.post('/api/treasure/user' , auth.usersOnly , treasureController.addUserTreasure)
app.get('/api/treasure/all' , auth.usersOnly , auth.adminsOnly , treasureController.getAllTreasure)

massive(CONNECTION_STRING).then((connectionInstance) => {
  app.set('db' , connectionInstance)
  console.log('Database Connected')
  app.listen(SERVER_PORT , () => console.log('Server listening on ' , SERVER_PORT))
})