module.exports = async function addTeam (server, req, res, next) {
  // incoming: teamname, email, password, joinCode
  // outgoing: results[], error

  try{
    let error = '';
    let verifiyCode = server.verify.makeid(6);
    let user,team,check;

    const { teamName, email, password ,joinCode, name } = req.body;

    const dbm = server.dbm;

    try{
     check = await dbm.competitions.find({joinCode : joinCode}).toArray();

    }

    catch(err){

      var ret = { error:err.message};
      res.status(500).json(ret);

    }

    if(check.length > 0){

      const newUser = 
      {

        name,
        email, 
        password,
        type : "team",
        isVerified: false,
        verifiyCode 
        
      };

      try{

       const something = await  dbm.users.insertOne(newUser);
       user = await dbm.users.findOne({name:name});

      }

      catch(err1){

        let ret = { error:err1.message};
      res.status(500).json(ret);
      }


    }
    console.log(check[0]);

    const newTeam = {

      teamName,
      user: user._id,
      competition: check[0]._id,
      instances : [],
      score:0
    };

    try{
      
      const something2 = await dbm.teams.insertOne(newTeam);
      team = await dbm.teams.findOne({teamName:teamName});
      
    }
    catch(err2){
      let ret = { error:err2.message};
      res.status(500).json(ret);
      
    }
    
    

    const query = { _id : check[0]._id};

    const query1 = { _id : user._id};

    const updateDocument = {

    $push: {"teams" : team._id}


    };

    const updateDocument1 = {

      $set:{

      "inst" : team._id

      }
  
      };




    
    const results =  await dbm.competitions.updateOne(query, updateDocument);

    const results2 = await dbm.users.updateOne(query1, updateDocument1);


    var ret = { error:error};
    res.status(200).json(ret);
  }
catch(err){
  var ret = {error:err.message}
  res.status(500).json(ret);
}
}
