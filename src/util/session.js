const ObjectId = require('mongodb').ObjectId;
const db = require('../db');


function genSid() {
  return `${ObjectId().valueOf()}`;
}

/// Returns User or null
async function authorize(sid) {
  let sessionResults = await db.sessions.find({ sid }).toArray();

  if (sessionResults.length == 1) {
    let userObjectId = sessionResults[0].user;
    let userResults = await db.users.find({ _id: userObjectId }).toArray();

    if (userResults.length == 1) {
      let user = userResults[0]; 
      return user;
    }
    else {
      return null;
    }
  }
  else {
    return null;
  }
}

async function clearUserSessions(userId) {
  const delResult = await db.sessions.deleteMany({ user: userId });
  console.log(delResult);
  if (delResult.deletedCount > 0) {
    console.log(`Deleted ${delResult.deletedCount} existing sessions`);
  }
  else {
    console.log('No existing user sessions');
  }

  return delResult.deleteCount;
}

async function createUserSession(userId) {
  let sid = genSid();
  const insertResult = await db.sessions.insertOne({
    sid,
    user: userId
  });
  return sid;
}


module.exports = {
  genSid,
  authorize,
  clearUserSessions,
  createUserSession
}
