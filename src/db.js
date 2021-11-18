const MongoClient = require('mongodb').MongoClient;

class DB {
  constructor() {
    this.db = null;
    this.users = null;
    this.sessions = null;
  }

  initMongoDB(url) {
    const client = new MongoClient(url);
    client.connect();
    this.db = client.db();
    this.sessions = this.db.collection('Sessions');
    this.users = this.db.collection('Users');
    return this.db;
  }

  getDB() {
    return this.db;
  }
}

module.exports = new DB();
