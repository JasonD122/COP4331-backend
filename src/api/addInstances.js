module.exports = async function addInstances (server, req, res, next) {

  // incoming: sid, instances
  // outgoing:  error

  let { instances } = req.body;
  const dbm= server.dbm;

  //User much be from a team
  const user = server.authedUser;
  const reqMachines = (await dbm.competitions.findOne({})).machines;
  let existingMachines = (await dbm.teams.findOne({ _id: user.inst }))
    .instances || [];

  console.log(existingMachines);

  let reqMachinesMap = {};
  let machinesMap = new Map();

  for (const m of reqMachines) {
    reqMachinesMap[m.name] = m; 
  }

  for (const m of existingMachines) {
    machinesMap.set(m.name, m);
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

    machinesMap.set(inst.name, {
      name: inst.name,
      ip: inst.ip,
      services: createdSrvs,
    });
  }

  await dbm.teams.updateOne(
    { _id: user.inst },
    { $set: { instances: [...machinesMap.values()] } }
  );

  res.status(200).json({ error: "" });
}

