module.exports = async function resetPassword (server,req, res, next) {

    // incoming: sid, machineObject
    // outgoing:  error
  const dbm = server.dbm;
  const password = server.verify.makeid(8);


  const {email} = req.body;
  let error = '';


  try {
    const result = await dbm.users.findOne({ email });
    
    if(!result){
      res.status(200).json({ error: "No user found" });
      return;
    }

    await dbm.users.updateOne(
      { _id: result._id }, 
      { $set: { password } },
    );

    await dbm.passResets.insertOne({ user : result._id });
  }
  catch (e) {
    error = e.toString();
  }

  let ret = { error:error };
  res.status(200).json(ret);
  
  }
