module.exports = async function register(server, req, res, next) {
  const dbm = server.dbm;
  const {email, password} = req.body;

  const existingUsers = await dbm.users.find({ email }).toArray();
  console.log(existingUsers);
  if (existingUsers.length > 0) {
    if (existingUsers.isVerified) {
      res.status(200).json({ error: "User already exists" });
      return;
    }
    else {
      const existingUserIds = existingUsers.map(u => u._id);
      await dbm.emailVerif.deleteMany({ user: { $in: existingUserIds } });
      await dbm.users.deleteMany({ _id: { $in: existingUserIds } });
    }
  }

  const comp = await dbm.competitions.findOne({});

  const result = await dbm.users.insertOne({
    email, 
    password, 
    type: 'admin', 
    inst: comp._id,
    isVerified: false
  });

  await dbm.emailVerif.insertOne({
    user: result.insertedId,
    code: server.verify.makeid(8)
  });

  res.status(200).json({error: ""});
  return;
}
