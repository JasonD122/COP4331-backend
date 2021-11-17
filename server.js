const SessionManager = require('./session')
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');           

const PORT = process.env.PORT || 5000;  
const url = 'mongodb+srv://jason2992:WeLoveCOP4331@cop4331.njgcb.mongodb.net/COP4331?retryWrites=true&w=majority';
//const url = 'mongodb+srv://cop4331.njgcb.mongodb.net/COP4331" --username jason2992 --password WeLoveCOP4331';

const app = express();
app.set(PORT);
app.use(cors());
app.use(bodyParser.json());
const { join } = require('path');
const { mkdir } = require('fs');
const client = new MongoClient(url);
client.connect();
const db = client.db();
const cols = {
  users: db.collection('Users'),
  sessions: db.collection('Sessions'),
  teams: db.collection('Teams'),
  comp: db.collection('Competition'),
};

const sm = new SessionManager(client.db());

// For Heroku deployment

/*
// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));

  app.get('*', (req, res) => 
 {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

*/

/*

 * ********************************
 * * COMPLETED & TESTED ENDPOINTS *
 * ********************************
 
 * ************************
 * * INCOMPLETE ENDPOINTS *
 * ************************
	 - deleteTeam
	 - deleteCompetition
	 - addTeamMember
	 - deleteTeamMember
	 - deleteUser
	 - addUser
	 - addMachine
	 - deleteMachine
	 - getScore


 * *********************
 * * NEED TO BE TESTED * 
 * *********************
   - addCompetition
	 - login 
	 - addTeam
	 - addMachine
	 - addInstances

 * ************
 * * PROBLEMS *
 * ************
 
 */

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



// ENDPOINT: Add Competition
app.post('/api/addCompetition', async (req, res) =>
{
  // incoming: SessionID, CompName, Team Array, machine_services
  // outgoing: error , joinCode
	
  const { teams, machine, start_time,end_time} = req.body;

  var joinCode = makeid(8);

  const newCompetition = {
    teams,
    machine, 
    start_time,
    end_time, 
    joinCode
  };
  
  let error = '';
  
  console.log("Trying something");

  try
  {
    const db = client.db();
    const result = await db.collection('Competition').insertOne(newCompetition);
  }
  catch(e)
  {
    res.status(500).json({message : e.toString()})
  }

  let ret = { error: error, joinCode:joinCode };
  res.status(200).json(ret);
});


// ENDPOINT: Add Competition
app.post('/api/deleteCompetition', async (req, res) =>
{
  // incoming: SessionID or Competition _id
  // outgoing: error , joinCode
	
  const { sid } = req.body;

  //should return user object
  const user = sm.authorize(sid);
  
  let error="";

  
  try
  {
    
    // we use user object to find competition to delete
    comp = await db.collection('Competition').find({ _id : user.inst});
  
    //for each team we find Users
    comp.teams.forEach(element => {
        
     const result =  db.collection('Teams').find({_id: element} );
  
     const result1 =  db.collection('Users').deleteOne({ _id : result.user});
  
     const result2 =  db.collection('Teams').deleteOne({ _id : element});
      
    });

    const del = await db.collection('Competition').deleteOne(comp);

  }
  catch(e)
  {
    res.status(500).json({message : e.toString()})
  }

  let ret = { error: error, joinCode:joinCode };
  res.status(200).json(ret);
});






// ENDPOINT: Login
app.post('/api/login', async (req, res, next) => {
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
  let user = await cols.users.find({ username, password }).toArray();
  console.log(user)
  if (user.length > 1 || user.length == 0) {
    console.log('Invalid user');
    return null;
  }
  let userId = user[0]._id;
  console.log(`Found user with id: ${userId}`);

  // Delete pre-existing sid, if it exists
  await sm.clearUserSessions(userId);


  const sid = await sm.createUserSession(userId);
  if (sid == null) {
    res.status(400).json({error: "User not found"});
  }
  else {
    res.status(200).json({error: "", sid});
  }
  console.log(`User logged in - created session: ${sid}`);
});


app.post('/api/testAuthorize', async (req, res) => {
  const body = req.body;
  if (!body.sid) {
    res.status(400).json({"error": "Bad request"});
  }
  const sid = body.sid;
  const user = await sm.authorize(sid);
  console.log(`Got: ${user}`);
  if (user) {
    console.log(`Successful authorization: username=${user.username}, id=${user._id}`);
    res.status(200).json({"error": "", "username": user.username});
  }
  else {
    res.status(500).json({"error": "shit"});
  }
});

// ENDPOINT: addTeam
//my idea here is that we are going to pass an array with all the teams with their information filled out.
app.post('/api/addTeam', async (req, res) => 
{
  // incoming: teamname, email, password, joinCode
  // outgoing: results[], error

  try{
    let error = '';
    let verifiyCode = makeid(6);

    const { teamName, email, password ,joinCode, name } = req.body;

    const db = client.db();

    try{
    const check = db.collection('Competition').find({joinCode : joinCode});

    }

    catch(err){

      var ret = { error:err.message};
      res.status(500).json(ret);

    }

    if(check.length > 0){

      const newUser = 
      {

        name,
        email, 
        password,
        type : "team",
        isVerified: false,
        verifiyCode 
        
      };

      try{

        const user = await  db.collection('Users').insertOne(newUser);

      }

      catch(err1){

        let ret = { error:err1.message};
      res.status(500).json(ret);
      }


    }

    const newTeam = {

      teamName,
      user: user._id,
      competition: check._id,
      instances : [],
      score:0
    };

    try{

      const team = await db.collection('Teams').insertOne(newTeam);

    }
    catch(err2){
      let ret = { error:err2.message};
    res.status(500).json(ret);
      
    }



    const query = { _id : check._id};

    const query1 = { _id : user._id};

    const updateDocument = {

    $push: {teams : team._id}


    };

    const updateDocument1 = {
      
      inst : team._id
  
      };




    
    const results =  await db.collection('Competition').updateOne(query, updateDocument);

    const results2 = await db.collection('Users').updateOne(query1, updateDocument1);


    var ret = { error:error};
    res.status(200).json(ret);
  }
catch(err){
  var ret = {error:err.message}
  res.status(500).json(ret);
}
});


// ENDPOINT: deleteTeam
// takes the team name and deletes it from a competition
app.post('/api/deleteTeam', async (req, res) => {
	
	let error = '';

	try {
		const db = client.db();
	}
	catch (e) {
		error = e.toString();
	}

	let ret = {error:error};
	res.status(200).json(ret);

});


// ENDPOINT: addTeamMember
// adds a team member to a team 
app.post('/api/addTeamMember', async (req, res) => {
	
	let error = '';

	try {
		const db = client.db();
	}
	catch (e) {
		error = e.toString();
	}
	
	let ret = {error:error};
	res.status(200).json(ret);

});


// ENDPOINT: deleteTeamMember
// deletes a team member from an established team. Does not delete as a user
app.post('/api/deleteTeamMember', async (req, res) => {
	
	let error = '';

	try {
		const db = client.db();
	}
	catch (e) {
		error = e.toString();
	}
	
	let ret =	 {error:error};
	res.status(200).json(ret);

});


// ENDPOINT: addUser
// adds a user to the system
app.post('/api/addUser', async (req, res) => {

	let error = '';

	try {
		const db = client.db();
	}
	catch (e) {
		error = e.toString();
	}

	let ret = {error:error};
	res.status(200).json(ret);

});


// ENDPOINT: deleteUser
// deletes a user from the system
app.post('/api/deleteUser', async (req, res) => {

	let error = '';

	try {
		const db = client.db();
	}
	catch (e) {
		error = e.toString();
	}

	let ret = {error:error};
	res.status(200).json(ret);

});


// ENDPOINT: createMachine
// creates a machine. Expects a JSON containing Machine/Service name, IP, and
// services to be added to the competition
app.post('/api/addMachine', async(req, res) => {

  // incoming: sid, machineObject
  // outgoing:  error

const {machineObject, sid} = req.body;
	let error = '';


	try {
		const db = client.db();

    const result = sm.authorize(sid);

    const update = db.collection('Teams').updateOne({name: result.name}, machineObject)

	}
	catch (e) {
		error = e.toString();
	}

	let ret = {error:error};
	res.status(200).json(ret);

});


// ENDPOINT: deleteMachine
// deletes a machine.
app.post('/api/deleteMachine', async (req, res) => {

	let error = '';

	try {
		const db = client.db();
	}
	catch (e) {
		error = e.toString();
	}

	let ret = {error:error};
  res.status(200).json(ret);

});


// ENDPOINT: getScore
// contiunously updates to retrieve a team's score. May contain the team name or
// competition id.
app.post('/api/getScore', async (req, res) => {
	
	let error = '';
  const { teamName } = req.body;
	try {
		const db = client.db();
    const results = await db.collection('Teams').find({"teamName": teamName}).toArray();
    
    var score = 0;

    if( results.length > 0 )
    {
      score= results[0].teams[0].score;
    }

    ret = {Score:score, error :''};
      res.status(200).json(ret);
	}
	catch (e) {
		var error1 = e.toString();

    res.status(500).json({error:error1})
	}

});


// ENDPOINT: Add Required Services
// my idea here is that we are going to pass an array with all the req_services with their information filled out.
app.post('/api/addReq_Services', async (req, res) => 
{
  // incoming: req_Service object arrqay
  // outgoing: results[], error

  var error = '';

  const { req_ServiceObject } = req.body;


  const db = client.db();

  // I'm thinking that the competion is the collection here and that the team object is going to be a document
  const results = await db.collection('competition').updateone("req_services",req_ServiceObject);
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i].Card );
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});


// ENDPOINT: Add Instances
// my idea here is that we are going to pass an array with all the instances with their information filled out.
// Using the team name we can find the team we are looking for and update it
app.post('/api/addInstances', async (req, res) => 
{
  // incoming: instances object arrqay
  // outgoing: res:200, error

  var error = '';

  const { InstanceObject , tname } = req.body;


  const db = client.db();

  await db.collection('competition').updateone({"teams.name":tname}, {$set:{ 'teams.$.instances':InstanceObject}});
  
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

//Used to make random string for join code.
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}


// db.test_invoice.update({user_id : 123456 , "items.item_name":"my_item_one"} , {$inc: {"items.$.price": 10}})

// Basic server stuff
app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});

