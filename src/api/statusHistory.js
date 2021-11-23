module.exports = async function statusHistory (server, req, res, next) {
  
  const dbm = server.dbm;
  const user = server.authedUser;

  let teamIds;
  
  switch(user.type) {
    case 'admin':
      let competition = await dbm.competitions.findOne({ _id: user.inst });
      teamIds = competition.teams;
      break;

    case 'team':
      teamIds = [ user.inst ];
      break;

    default:
      res.status(500).json({ error: `Unknown user type: ${user.type}` });
      return;
  }

  if (!teamIds) {
    res.status(200).json({ error:"", machines: [] });
    return;
  }

  let response = {
    error: "",
    teams: [],
  };

  let teams = await dbm.teams.find({ _id: { $in: teamIds } }).toArray();
  for (const team of teams) {
    // This is to be resilient against db changes or missing fields...
    let machines = [];
    for (const machine of team.instances) {
      let services = [];

      for (const service of machine.services) {
        services.push({
          name: service.name || "",
          port: service.port || 0,
          status: service.status || false,
          history: service.history || [],
          upCount: service.upCount || 0,
          downCount: service.downCount || 0,
        });
      }

      machines.push({
        name: machine.name || "",
        ip: machine.ip || 0,
        services
      })
    }

    response.teams.push({
      name: team.name,
      machines: machines,
    });
  }

  res.status(200).json(response);
}  
