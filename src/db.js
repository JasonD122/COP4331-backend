const MongoClient = require('mongodb').MongoClient;

class DBManager {
  constructor() {
    this.db = null;
    this.users = null;
    this.sessions = null;
    this.compititions = null;
    this.teams = null;
  }

  initMongoDB(url) {
    const client = new MongoClient(url);
    client.connect();
    this.db = client.db();

    this.sessions = this.db.collection('Sessions');
    this.users = this.db.collection('Users');
    this.competitions = this.db.collection('Competition');
    this.teams = this.db.collection('Teams');

    return this.db;
  }

  async doesUserExist(email) {
    const results = await this.users.find({ email }).toArray();
    return results > 1;
  }
}

module.exports = new DBManager();
