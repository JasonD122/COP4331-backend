module.exports = async function addTeam (req, res, next) {
  // incoming: teamname, email, password, joinCode
  // outgoing: results[], error

  try{
    let error = '';
    let verifiyCode = makeid(6);

    const { teamName, email, password ,joinCode, name } = req.body;

    const db = client.db();

    try{
    const check = db.collection('Competition').find({joinCode : joinCode});

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

        const user = await  db.collection('Users').insertOne(newUser);

      }

      catch(err1){

        let ret = { error:err1.message};
      res.status(500).json(ret);
      }


    }

    const newTeam = {

      teamName,
      user: user._id,
      competition: check._id,
      instances : [],
      score:0
    };

    try{

      const team = await db.collection('Teams').insertOne(newTeam);

    }
    catch(err2){
      let ret = { error:err2.message};
    res.status(500).json(ret);
      
    }



    const query = { _id : check._id};

    const query1 = { _id : user._id};

    const updateDocument = {

    $push: {teams : team._id}


    };

    const updateDocument1 = {
      
      inst : team._id
  
      };




    
    const results =  await db.collection('Competition').updateOne(query, updateDocument);

    const results2 = await db.collection('Users').updateOne(query1, updateDocument1);


    var ret = { error:error};
    res.status(200).json(ret);
  }
catch(err){
  var ret = {error:err.message}
  res.status(500).json(ret);
}
}
