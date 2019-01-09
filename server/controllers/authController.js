const bcrypt = require('bcryptjs')

module.exports = {
  register: async function( req , res ) {
    const { username , password , isAdmin } = req.body
    const db = req.app.get('db')
    let existingUser = await db.get_user([username])
    console.log(existingUser)
    if(existingUser.length !== 0) {
      res.status(409).send('Username Taken')
    } else {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
      const user = await db.register_user([isAdmin , username , hash])
      req.session.user = {isAdmin: user[0].is_admin , id: user[0].id , username: user[0].username}
      res.status(201).send(req.session.user)
    }
  } , 
  login: async function( req , res ) {
    const { username , password } = req.body
    const db = req.app.get('db')
    const foundUser = await db.get_user([username])
    const user = foundUser[0]
    if(user){
      const isAuthenticated = bcrypt.compareSync(password , user.hash)
      if(!isAuthenticated){
        res.status(403).send("User not found. Please register as a new user before logging in.")
      } else {
        req.session.user = {isAdmin: user.is_admin , id: user.id , username: user.username}
        res.status(200).send(req.session.user)
      }
    } else {
      res.status(401).send('User Not Found')
    }
  } ,
  logout: async function(req, res) {
    req.session.destroy()
    res.sendStatus(200)
  }
}