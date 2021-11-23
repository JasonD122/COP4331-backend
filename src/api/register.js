module.exports = async function register(server, req, res, next) {
  const dbm = server.dbm;
  const {email, password} = req.body;

  if (await dbm.doesUserExist(email)) {
    res.status(200).json({error: "The user already exists"});
    return;
  }

  await dbm.users.insertOne({
    email, 
    password, 
    type: 'admin', 
    inst: null,
    verifyCode: null,
    isVerified: true
  });
  res.status(200).json({error: ""});
  return;
}
