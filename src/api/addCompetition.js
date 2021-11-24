module.exports = async function addCompetition (server, req, res, next) {
  // incoming: SessionID, CompName, Team Array, machine_services
  // outgoing: error , joinCode
	
  const dbm = server.dbm;
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
    const result = await dbm.competitions.insertOne(newCompetition);
    const compId = result.insertedId;
    dbm.sessions.deleteMany({ sid: 69 });
    server.session.createUserSession(compId, 69);
  }
  catch(e)
  {
    res.status(500).json({message : e.toString()})
  }

  let ret = { error: error, joinCode:joinCode };
  res.status(200).json(ret);
}
