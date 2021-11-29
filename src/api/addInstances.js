module.exports = async function addInstances (server, req, res, next) {

  // incoming: sid, instances
  // outgoing:  error

  let { instances } = req.body;
  const dbm= server.dbm;

  //User much be from a team
  const user = server.authedUser;
  const reqMachines = (await dbm.competitions.findOne({})).machines;
  const existingMachines = (await dbm.teams.findOne({ _id: user.inst })).instances;

  if (reqMachines.length != instances.length) {
    res.status(400).json({ error: "Num required machines doesn't match num instances passed" });
    return;
  }

  let reqMachinesMap = {};

  for (const m of reqMachines) {
    reqMachinesMap[m.name] = m; 
  }

  for (const inst of instances) {
    const m = reqMachinesMap[inst.name]; 
    // I'm lazy, get over the naming
    const createdSrvs = [];
    if (!m) {
      res.status(400).json({ error: `Unknown machine: ${inst.name}` });
      return;
    }

    for (const srv of m.services) {
      createdSrvs.push({
        name: srv.name,
        port: srv.port,
        status: false,
        history: [],
        upCount: 0,
        downCount: 0,
      });
    }

    createdInsts.push({
      name: inst.name,
      ip: inst.ip,
      services: createdSrvs,
    });
  }


  res.status(200).json({ error: "" });
}

