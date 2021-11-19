module.exports = async function deleteCompetition(server, req, res, next) {
  // incoming: SessionID or Competition _id
  // outgoing: error , joinCode
	
  const dbm = server.dbm;
  const user = server.authedUser;
  const { sid } = req.body;

  //should return user object
  //const user = sm.authorize(sid);
  
  let error="";
  try
  {
       
    const compe = await dbm.competitions.findOne({_id : user.inst});

    if (!compe) {
      res.status(200).json({error: "Competition doesn't exist"});
      return;
    }
    
    const length1 = compe.teams.length;
    
    let counter = 0;

    const arr = compe.teams;
    
    
    
    for(counter = 0; counter < length1; counter++){
      
      var neeDelete = await dbm.teams.findOne({_id : arr[counter]});
      console.log(neeDelete);
      
      var delete2 =  await dbm.users.deleteOne({_id:neeDelete.user})
    }
    

    const delete1 = await dbm.teams.deleteMany({ _id: 

        {

          $in : compe.teams

        }
    
    
    
    });

    const delete3 = dbm.competitions.deleteOne({_id:compe._id});


    let ret = {error: ""};
    res.status(200).json(ret);
    
  }
  catch(err1){
    
    let ret= {error: err1.message}
    res.status(450).json(ret);
  }


}
