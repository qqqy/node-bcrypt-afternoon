module.exports = {
  dragonTreasure: async function(req , res) {
    const db = req.app.get('db')
    res.status(200).send(await db.get_dragon_treasure(1))
  } ,
  getUserTreasure: async function(req,res){
    const db = req.app.get('db')
    res.status(200).send(await db.get_user_treasure(req.session.user.id))
  } ,
  addUserTreasure: async function( req , res ) {
    const {treasureUrl} = req.body
    const {id} = req.session.user
    // console.log(treasureUrl , id)
    const db = req.app.get('db')
    const userTreasure = await db.add_user_treasure(treasureUrl , id)
    // console.log(userTreasure)
    res.status(200).send(userTreasure)
  } ,
  getAllTreasure: async function( req , res ) {
    const db = req.app.get('db')
    const result = await db.get_all_treasure()
    res.status(200).send(result)
  }
}