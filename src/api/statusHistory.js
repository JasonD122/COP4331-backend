module.exports = async function statusHistory (server, req, res, next) {

 
    // incoming: sid
    // outgoing:  error, machineObject depending on sid
  
  const { sid} = req.body;
  let error = '';
  let user,userID, instance,count;
  let checks =[];
  
  const dbm = server.dbm;
  
  try {
  
  userID = await dbm.sessions.findOne({ sid: sid });
  
 user = await dbm.users.findOne({ _id: userID.user });
 console.log(user);
  
  console.log(userID);
  
  if( user.userType.localeCompare("admin")==0){
    
      instance = await dbm.competitions.find({_id:user.inst});

      for(let i = 0; i < instance.teams.length; i++){

        let temp = dbm.teams.findOne({_id : instance.teams[i]});


        count = checks.push(temp.instances);

      }

      console.log(checks);

      ret = {error:"",check:checks};

      res.status(200).json(ret);


  }

  else if( user.type.localeCompare("team")==0){

    instance = dbm.teams.findOne({_id : user.inst});

    const check = instance.instances;

    console.log(check  + " looked up teams");
    ret = {error:"",check:check};

      res.status(200).json(ret);

  }

  else{
  
  let ret = {error:"Didn't find shit"};
  res.status(500).json(ret);

  }
  
}

catch (e) {
    error = e.toString();

 let ret = {error:error};
 res.status(500).json(ret);
}

}  