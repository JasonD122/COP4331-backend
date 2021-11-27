module.exports = async function addCompetition (server, req, res, next) {
  // incoming: SessionID, CompName, Team Array, machine_services
  // outgoing: error , joinCode
	
  const dbm = server.dbm;
  const body = req.body;
  const user = server.authedUser;
  const {sid, machines, maxTeams, startTime,endTime,name} = body;

  var joinCode = server.verify.makeid(8);

  const existingComp = await dbm.competitions.findOne({});

  const newCompetition = {
    teams:[],
    machines: machines, 
    startTime,
    endTime, 
    joinCode,
    maxTeams,
    name,
    joinCode
  };

  if (body.debug && existingComp.machiens) {
    if (machines.length === 0) newCompetition.machines = existingComp.machines;
  }
  
  let error = '';

  // const existingComps = await dbm.competitions.find({ name }).toArray();
  // if (existingComps.length > 0) {
  //   res.status(200).json({ error: `Competition '${name}' already exists` });
  //   return;
  // }

  try
  {
    if (body.debug && body.debug !== 'dontdelete') {
      await dbm.competitions.deleteMany({});
    }

    const result = await dbm.competitions.insertOne(newCompetition);
    const teamIds = (await dbm.teams.find({}, { _id: 1 })
      .toArray())
      .map(o => o._id);

    if (req.body.debug) {
      await dbm.users.updateMany(
        { type: 'admin' },
        { 
          $set: { 
            inst: result.insertedId,
          }
        }
      );

      await dbm.competitions.updateOne(
        { _id: result.insertedId },
        { $set: { teams: teamIds } }
      );
    }

    // await dbm.users.updateOne(
    //   { _id: user._id },
    //   { $set: { inst: result.insertedId }}
    // );

    // const compId = result.insertedId;
    // dbm.users.deleteMany({ email: "megachad" });
    // const chadResult = await dbm.users.insertOne({
    //   password: "420",
    //   inst: compId,
    //   email: "megachad",
    //   type: "admin",
    //   isVerified: true,
    //   name: 'Ruler of all Chads'
    // });
    // dbm.sessions.deleteMany({ sid: "69" });
    // server.session.createUserSession(chadResult.insertedId, "69");
  }
  catch(e)
  {
    res.status(500).json({message : e.toString()})
  }

  let ret = { error: error, joinCode:joinCode };
  res.status(200).json(ret);
}
