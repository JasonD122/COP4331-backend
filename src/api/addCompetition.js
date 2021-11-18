module.exports = function addCompetition (req, res, next) 
{
  // incoming: SessionID, CompName, Team Array, machine_services
  // outgoing: error , joinCode
	
  const { teams, machine, start_time,end_time} = req.body;

  var joinCode = makeid(8);

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
    const db = client.db();
    const result = await db.collection('Competition').insertOne(newCompetition);
  }
  catch(e)
  {
    res.status(500).json({message : e.toString()})
  }

  let ret = { error: error, joinCode:joinCode };
  res.status(200).json(ret);
}
