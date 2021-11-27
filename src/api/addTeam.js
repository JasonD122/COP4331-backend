module.exports = async function addTeam (server, req, res, next) {
  const dbm = server.dbm;
  const { name, password, joinCode } = req.body;

  const comp = await dbm.competitions.findOne({ joinCode });

  if (!comp) {
    res.status(200).json({ 
      error: `Competition with join code ${joinCode} not found`
    });
    return;
  }

  const teamsWithName = await dbm.teams.find({ name }).toArray();

  if (teamsWithName.length > 0) {
    res.status(200).json({ error: `Team ${team} already exists` });
    return;
  }

  const newTeam = await dbm.teams.insertOne({ 
    name, 
    password,
    competition: comp._id,
    instances: [],
    score: 0,
  });

  const newUser = await dbm.users.insertOne({
    name,
    email: name,
    password,
    type: 'team',
    inst: newTeam.insertedId,
    isVerified: true
  });

  await dbm.competitions.updateOne(
    { joinCode },
    { $push: { teams: newTeam.insertedId } }
  );

  const newSesh = await server.session.createUserSession(newUser.insertedId);

  res.status(200).json({ error: "", sid: newSesh });
}
