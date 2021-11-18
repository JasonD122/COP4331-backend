const SessionManager = require('./session')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');           

const PORT = process.env.PORT || 5000;  
const url = 'mongodb+srv://jason2992:WeLoveCOP4331@cop4331.njgcb.mongodb.net/COP4331?retryWrites=true&w=majority';
//const url = 'mongodb+srv://cop4331.njgcb.mongodb.net/COP4331" --username jason2992 --password WeLoveCOP4331';
const session = require('./util/session'); 
const dbm = require('./db');
const verify = require('./util/verify');

const db = dbm.initMongoDB(url);

console.log(db);
var dbCols = {
  users: db.collection('Users'),
  sessions: db.collection('Sessions'),
};
console.log(dbCols);

const app = express();
app.set(PORT);
app.use(cors());
app.use(bodyParser.json());
// const { join } = require('path');
// const { mkdir } = require('fs');
// const cols = {
//   users: db.collection('Users'),
//   sessions: db.collection('Sessions'),
//   teams: db.collection('Teams'),
//   comp: db.collection('Competition'),
// };

// const sm = new SessionManager(client.db());

function API(name) {
  return require(`./api/${name}`);
}

function preHandler(
  fieldsDef,  
  reqSidAuth,
  handler
) {
  if (!handler) {
    throw 'No handler passed!';
  }

  // console.log(fieldsDef);
  // console.log(reqSidAuth);
  // console.log(handler);
  return async function (req, res, next) {
    const body = req.body;
    let authedUser = null;

    if (fieldsDef) {
      let body = req.body;
      let badStatus = () => {
        res.status(400).json({
          error: `Bad request! Expected: ${Object.keys(fieldsDef)}`
        });
      }

      if (Object.keys(body).length != Object.keys(fieldsDef).length) {
        badStatus();
        return;
      }
      else {
        console.log(fieldsDef);
        for (const reqKey in body) {
          console.log(reqKey);
          console.log(fieldsDef[reqKey]);
          if (!fieldsDef[reqKey]) {
            badStatus();
            return;
          }
        }
      }
    }

    if (reqSidAuth) {
      const sid = body.sid;
      if (!sid) {
        res.status(400).json({
          error: "Bad request! SID is required for session verification"
        });
        return;
      }
      authedUser = await session.authorize(sid);
      if(!authedUser) {
        res.status(400).json({
          error: "Invalid session!"
        });
        return;
      }
    }

    let server = {
      authedUser,
      app,
      dbm,
      session,
      verify,
    };

    handler(server, req, res, next);
  };
}

// Set header
app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/login', preHandler(
  {email: 'string:email', password: 'string'}, 
  false, 
  API('login')
));

app.post('/api/addCompetition', preHandler(
  {
    sessionId: 'string',
    name: 'string',
    maxTeams: 'int',
    startTime: 'string:datetime',
    endTime: 'string:datetime',
    machines: 'array',
  },
  true,
  API('addCompetition')
));

app.post('/api/addTeam', preHandler(
  {email: 'string:email', password: 'string', name: 'string', joinCode: 'string'}, 
  true,
  API('addTeam')
))

app.post('/api/testAuthorize', preHandler(
  null, 
  true, 
  API('testAuthorize')
));

// Basic server stuff
app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});

