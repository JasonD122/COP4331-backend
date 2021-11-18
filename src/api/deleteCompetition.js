module.exports = function deleteCompetitionHandler(req, res, next) {
  // incoming: SessionID or Competition _id
  // outgoing: error , joinCode
	
  const { sid } = req.body;

  //should return user object
  const user = sm.authorize(sid);
  
  let error="";

  
  try
  {
    
    // we use user object to find competition to delete
    comp = await db.collection('Competition').find({ _id : user.inst});
  
    //for each team we find Users
    comp.teams.forEach(element => {
        
     const result =  db.collection('Teams').find({_id: element} );
  
     const result1 =  db.collection('Users').deleteOne({ _id : result.user});
  
     const result2 =  db.collection('Teams').deleteOne({ _id : element});
      
    });

    const del = await db.collection('Competition').deleteOne(comp);

  }
  catch(e)
  {
    res.status(500).json({message : e.toString()})
  }

  let ret = { error: error, joinCode:joinCode };
  res.status(200).json(ret);
}
