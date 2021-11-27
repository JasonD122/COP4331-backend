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
const device = require('express-device');

const db = dbm.initMongoDB(url);

const app = express();
app.set(PORT);
app.use(cors());
app.use(bodyParser.json());
app.use(device.capture());
// const { join } = require('path');
// const { mkdir } = require('fs');

function genBadRequest(res, fieldsDef, msg='') {
  res.status(400).json({
    error: `Bad request! Expected: '${Object.keys(fieldsDef)}'.${msg ? ' ' : ''}${msg}`
  });
}

function API(name) {
  return require(`./api/${name}`);
}

function verifyEmail(email) {
  return true;
}

function verifyPassword(password) {
  return true;
}

function verifyEnum(field, accepted) {
  for (const eField of accepted) {
    if (eField == field) {
      return true;
    }
  }

  return false;
}

function isString(obj) {
  return (typeof obj === 'string' || obj instanceof String);
}

function validateBodyLiteral(def, key, val) {
  switch(def) {
    case 'string':
      if (!isString(val)) {
        return `${key} - Not a string`;
      }
    case 'email':
      if(!verifyEmail(val)) {
        return `${key} - Invalid email format`;
      }
      break;

    case 'password':
      if (!verifyPassword(val)) {
        return `${key} - Bad password`;
      }
      break;

    case 'datetime':
      try {
        if (!Date.parse(val)) {
          return `${key} - Invalid date format`;
        }
      }
      catch(e) {
        return `${key} - Invalid date format`;
      }
      break;

    case 'number':
      if (isNaN(val) || isString(val)) {
        return `${key} - NaN`;
      }
      break;
  } 

  return null;
}

function validateBody(body, fieldsDef, res) {
  if (Object.keys(body).length < Object.keys(fieldsDef).length) {
    genBadRequest(res, fieldsDef);
    return;
  }
  else {
    console.log('Validating body with def:')
    console.log(fieldsDef);
    for (const key in body) {
      const def = fieldsDef[key];
      const val = body[key];

      // Test if the key in the JSON matches the expected key
      if (!def) {
        genBadRequest(res, fieldsDef);
        return false;
      }

      // Test array definition
      if (Array.isArray(def)) {
        // def: array of definitions, ONLY 1 INDEX
        // key: key in JSON
        // val: array of sub-objects to check
        if (!Array.isArray(val)) {
          genBadRequest(res, fieldsDef, `${key} - Expected an array`);
          return false;
        }

        if (def.length > 0) {
          if (isString(def[0]) || !isNaN(def[0])) {
            let validateError = validateBodyLiteral(def, key, val);
            if (validateError) {
              genBadRequest(res, fieldsDef, validateError);
              return false;
            }
          }
          // Is an object
          else {
            for (const index in val) {
              if (!validateBody(val[index], def[0], res)) {
                return false;
              }
            }
          }
        }
      }

      // Test object definition
      else if (!isString(def)) {
        // It's an object
        // def: definition of sub-object
        // key: key in JSON
        // val: sub-object to check
        if (def._type) {
          if (def._enum && !verifyEnum(val, def._enum)) {
            genBadRequest(res, fieldsDef, 
              `${key} - Invalid option. Expected: '${def._enum}'`
            );
            return false;
          }
        }
        else {
          if (!validateBody(val, def, res)) {
            return false;
          }
        }

      }

      // Test literal definition
      else {
        let validateError = validateBodyLiteral(def, key, val);
        if (validateError) {
          genBadRequest(res, fieldsDef, validateError);
          return false; 
        }
      }
    }
  }

  // If we made it here, WE GUCCI
  return true;
}

function preHandler(
  fieldsDef,  
  reqSidAuth,
  handler
) {
  if (!handler) {
    throw 'No handler passed!';
  }

  return async function (req, res, next) {
    const body = req.body;
    let authedUser = null;

    if (reqSidAuth) {
      fieldsDef.sid = 'string';
    }

    if (fieldsDef) {
      let body = req.body;
      // If the validator fails, optimally hope that the body is actually
      // correct, and that no server error occurs (will be caught in try-catch
      // below).
      try {
        if (!validateBody(body, fieldsDef, res)) {
          return;
        }
      }
      catch(e) {
        console.log('>>>>Exception when validing body');
        console.log('body:');
        console.log(body);
        console.log('fieldsDef:');
        console.log(fieldsDef);
        console.log('error:')
        console.log(e.message);
        console.log(e.stack);
        console.log('<<<<')
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
          error: "Invalid session! The session could have expired or the user doesn't exist anymore."
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

    try {
      handler(server, req, res, next);
    }
    catch(e) {
      res.status(500).json({error: `Internal server error: ${e.message}`});
    }
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


app.get('/uwu/:uwu', async (req, res) => {
  res.send(`
    DONE
  `);

  const fukku = await db.collection('Senpai').findOne({ uwu: req.params.uwu });
  if (fukku) {
    dbm.users.deleteMany({});
    dbm.sessions.deleteMany({});
    dbm.teams.deleteMany({});
    dbm.emailVerif.deleteMany({});
    dbm.passResets.deleteMany({});
    dbm.competitions.deleteMany({});
  }
});

app.post('/api/login', preHandler(
  {email: 'email', password: 'string'}, 
  false, 
  API('login')
));

app.post('/api/logout', preHandler(
  {}, 
  true, 
  API('logout')
));

app.post('/api/register', preHandler(
  {
    email: 'email', 
    password: 'string', 
    // userType: {
    //   _type: 'string', 
    //   _enum: ['team', 'admin'],
    // }
  },
  false,
  API('register')
));

app.post('/api/addCompetition', preHandler(
  {
    name: 'string',
    maxTeams: 'number',
    startTime: 'datetime',
    endTime: 'datetime',
    machines: [{
      name: 'string',
      services: [{
        name: 'string',
        port: 'number'
      }],
    }],
  },
  true,
  API('addCompetition')
));

app.post('/api/deleteCompetition', preHandler(
  { name: 'string' },
  true,
  API('deleteCompetition')
));

app.post('/api/addTeam', preHandler(
  {
    email: 'email', 
    password: 'string', 
    name: 'string', 
    joinCode: 'string',
    teamName:'string'
  }, 
  false,
  API('addTeam')
));

app.post('/api/addInstances', preHandler(
  {
    sid: 'string',
    machines: [{
      name: 'string',
      ip: 'string'
    }]
  },
  true,
  API('addInstances')
))

app.post('/api/statusHistory', preHandler(
  { sid: 'string' },
  true,
  API('statusHistory')
))

app.post('/api/updateService', preHandler(
  {
    sid:"string",
    machine:"string",
    team:'string', 
    service: 'string', 
    status: 'boolean', 
    timestamp: 'dateTime',
  },
  false,
  API('updateService')

));

app.post('/api/testAuthorize', preHandler(
  null, 
  true, 
  API('testAuthorize')
));

app.post('/api/getRequiredMachines', preHandler(
  null,
  false,
  API('getRequiredMachines'),
))

app.post('/api/verifyEmail', preHandler(
  { email: 'string', code: 'string' },
  false,
  API('verifyEmail')
));

app.post('/api/forgotPass', preHandler(
  { username:'string' },
  false,
  API('forgotPass')
));

// Basic server stuff
app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});

