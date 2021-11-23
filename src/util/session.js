const ObjectId = require('mongodb').ObjectId;
const dbm = require('../db');


function genSid() {
  return `${ObjectId().valueOf()}`;
}

function deleteSession(sid) {
  dbm.sessions.deleteOne({ sid });
}

/// Returns User or null
async function authorize(sid) {
  let sessionResults = await dbm.sessions.find({ sid }).toArray();

  if (sessionResults.length == 1) {
    let userObjectId = sessionResults[0].user;
    let userResults = await dbm.users.find({ _id: userObjectId }).toArray();

    if (userResults.length == 1) {
      let user = userResults[0]; 
      return user;
    }
    // Something weird occured and we have a dangling user session - delete it
    else if (userResults.length == 0) {
      deleteSession(sid);  
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
  const delResult = await dbm.sessions.deleteMany({ user: userId });
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
  const insertResult = await dbm.sessions.insertOne({
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
