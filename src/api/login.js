const session = require('../util/session');
const db = require('../db');

module.exports = async function login(req, res, next, params) {
  const body = req.body;
  if (!body.username || !body.password) {
    res.status(400).json({error: "Bad request"});
    return;
  }
  const username = body.username;
  const password = body.password;

  console.log(`Got login request: username=${username}, password=${password}`);
  // Get user
  console.log(`Attempting to log in user ${username}`);
  let user = await db.users.find({ username, password }).toArray();
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
    res.status(400).json({error: "User not found"});
  }
  else {
    res.status(200).json({error: "", sid});
  }
  console.log(`User logged in - created session: ${sid}`);
}

