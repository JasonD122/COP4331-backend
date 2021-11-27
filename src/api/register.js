module.exports = async function register(server, req, res, next) {
  const dbm = server.dbm;
  const {email, password} = req.body;

  if (await dbm.doesUserExist(email)) {
    res.status(200).json({error: "The user already exists"});
    return;
  }

  const result = await dbm.users.insertOne({
    email, 
    password, 
    type: 'admin', 
    inst: null,
    isVerified: false
  });

  await dbm.emailVerif.insertOne({
    user: result.insertedId,
    code: server.verify.makeid(8)
  });

  res.status(200).json({error: ""});
  return;
}
