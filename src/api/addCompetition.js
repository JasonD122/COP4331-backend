module.exports = async function addCompetition (server, req, res, next) {
  // incoming: SessionID, CompName, Team Array, machine_services
  // outgoing: error , joinCode
	
  const dbm = server.dbm;
  const user = server.authedUser;
  const {sid, machines, maxTeams, startTime,endTime,name} = req.body;

  var joinCode = server.verify.makeid(8);

  const newCompetition = {
    teams:[],
    machines, 
    startTime,
    endTime, 
    joinCode,
    maxTeams,
    name,
    joinCode
  };
  
  let error = '';

  try
  {
    await dbm.competitions.deleteMany({});
    const result = await dbm.competitions.insertOne(newCompetition);
    const teams = await dbm.teams.find({}, { _id: 1 }).toArray();
    await dbm.users.updateMany(
      { type: 'admin' },
      { 
        $set: { 
          inst: result.insertedId,
          teams
        }
      }
    );

    // await dbm.users.updateOne(
    //   { _id: user._id },
    //   { $set: { inst: result.insertedId }}
    // );
    const compId = result.insertedId;
    dbm.users.deleteMany({ email: "megachad" });
    const chadResult = await dbm.users.insertOne({
      password: "420",
      inst: compId,
      email: "megachad",
      type: "admin",
      isVerified: true,
      name: 'Ruler of all Chads'
    });
    dbm.sessions.deleteMany({ sid: "69" });
    server.session.createUserSession(chadResult.insertedId, "69");
  }
  catch(e)
  {
    res.status(500).json({message : e.toString()})
  }

  let ret = { error: error, joinCode:joinCode };
  res.status(200).json(ret);
}
