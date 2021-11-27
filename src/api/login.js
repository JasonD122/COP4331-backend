
module.exports = async function login(server, req, res, next) {
  const dbm = server.dbm;
  const session = server.session;

  const body = req.body;
  if (!body.email || !body.password) {
    res.status(400).json({error: "Bad request"});
    return;
  }
  const email = body.email;
  const password = body.password;

  console.log(`Got login request: email=${email}, password=${password}`);
  // Get user
  console.log(`Attempting to log in user ${email}`);

  let user = await dbm.users.find({ email, password }).toArray();
  console.log(user)

  if (user.length > 1 || user.length == 0) {
    res.status(400).json({error: "User not found"});
    console.log('Invalid user');
    return null;
  }
  let userId = user[0]._id;
  console.log(`Found user with id: ${userId}`);

  // Delete pre-existing sid, if it exists
  await session.clearUserSessions(userId);

  const sid = await session.createUserSession(userId);
  if (sid == null) {
    res.status(200).json({ error: "User not found" });
  }
  else {
    res.status(200).json({ error: "", sid, type: user[0].type });
  }
  console.log(`User logged in - created session: ${sid}`);
}

