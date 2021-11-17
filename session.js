const ObjectId = require('mongodb').ObjectId;
// import {SystemError} from 'node'

 class SessionManager {
  static ERRORS = {
    USER_NOT_FOUND: "User not found",
  };

  constructor(db) {
    this.db = db;
    this.userCol = db.collection('Users');
    this.sessionCol = db.collection('Sessions');
  }

  static genSid() {
    return `${ObjectId().valueOf()}`;
  }

  /// Returns User or null
  async authorize(sid) {
    let sessionResults = await this.sessionCol.find({ sid }).toArray();

    if (sessionResults.length == 1) {
      let userObjectId = sessionResults[0].user;
      let userResults = await this.userCol.find({ _id: userObjectId }).toArray();

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

  async clearUserSessions(userId) {
    const delResult = await this.sessionCol.deleteMany({ user: userId });
    console.log(delResult);
    if (delResult.deletedCount > 0) {
      console.log(`Deleted ${delResult.deletedCount} existing sessions`);
    }
    else {
      console.log('No existing user sessions');
    }

    return delResult.deleteCount;
  }

  async createUserSession(userId) {
    let sid = SessionManager.genSid();
    const insertResult = await this.sessionCol.insertOne({
      sid,
      user: userId
    });
    return sid;
  }

}

module.exports = SessionManager;
