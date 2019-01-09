module.exports = {
  usersOnly: function(req, res, next) {
    // console.log('usersOnly invoked')
    if (!req.session.user){
      res.status(401).send('Please log in')
    } else {
      // console.log(req.session)
      next()
    }
  } ,
  adminsOnly: function( req , res , next ) {
    if(!req.session.user.isAdmin){
      return res.status(403).send('You are not an admin.')
    }
    next()
  }
}