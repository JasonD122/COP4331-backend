module.exports = async function getRequiredMachines(server, req, res, next) {
  const dbm = server.dbm;
  const body = req.body;

  let competition;

  if (body.sid) {
    const user = await server.session.authorize(body.sid);

    if (!user) {
      res.status(200).json({ error: "Admin or team not found" });
      return;
    }

    if (!user.inst) {
      res.status(500).json({ error: "User is not associated with a team or competition" });
      return;
    }

    if (user.type === 'team') {
      const team = await dbm.users.findOne({ _id: user.inst });

      if (!team) {
        res.status(500).json({ error: "No team found!" });
        return;
      }

      if (!team.competition) {
        res.status(500).json({ error: "No competition attached to team!" });
        return;
      }
      
      competition = await dbm.competitions.findOne({ _id: team.competition });
    }

    else if (user.type === 'admin') {
      competition = await dbm.competitions.findOne({ _id: user.inst });
    }
    else {
      res.status(500).json({ error: "Unknown user type. Jason fucked up! ;)" });
      return;
    }
  }
  else if (body.joinCode) {
    competition = await dbm.competitions.findOne({ joinCode: body.joinCode });
  }
  else {
    competition = await dbm.competitions.findOne({});
  }

  if (!competition) {
    res.status(300).json({ error: "Competition not found" });
    return;
  }

  let machines = [];

  if (competition.machines) {
    for (const m of competition.machines) {
      if (!m) continue;
      let services = [];

      if (m.services) {
        for (const s of m.services) {
          services.push({
            name: s.name || "",
            port: s.port || 0,
          });
        }
      }

      machines.push({
        name: m.name || "",
        services,
      });
    }
  }

  res.status(200).json({ error: "", machines });
}
