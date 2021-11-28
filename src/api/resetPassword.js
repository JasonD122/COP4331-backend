module.exports = async function resetPassword (server,req, res, next) {

    // incoming: sid, machineObject
    // outgoing:  error
  const dbm = server.dbm;
  const password = server.verify.makeid(8);


  const {email} = req.body;
  let error = '';


  try {
    const user = await dbm.users.findOne({ email });
    
    if(!user){
      res.status(200).json({ error: "No user found" });
      return;
    }

    server.session.clearUserSessions(user._id);

    await dbm.users.updateOne(
      { _id: user._id }, 
      { $set: { password } },
    );

    await dbm.passResets.insertOne({ user : user._id });
  }
  catch (e) {
    error = e.toString();
  }

  let ret = { error:error };
  res.status(200).json(ret);
  
  }
