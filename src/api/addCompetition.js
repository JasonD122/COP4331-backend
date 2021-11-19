module.exports = async function addCompetition (server, req, res, next) {
  // incoming: SessionID, CompName, Team Array, machine_services
  // outgoing: error , joinCode
	
  const dbm = server.dbm;
  const { teams, machine, start_time,end_time} = req.body;

  var joinCode = server.verify.makeid(8);

  const newCompetition = {
    teams,
    machine, 
    start_time,
    end_time, 
    joinCode
  };
  
  let error = '';
  
  console.log("Trying something");

  try
  {
    const result = await dbm.competitions.insertOne(newCompetition);
  }
  catch(e)
  {
    res.status(500).json({message : e.toString()})
  }

  let ret = { error: error, joinCode:joinCode };
  res.status(200).json(ret);
}
