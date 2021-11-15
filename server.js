
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');           
const PORT = 5000;  


const app = express();
// app.set('port', 5000);
app.use(cors());
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://jason2992:WeLoveCOP4331@cop4331.njgcb.mongodb.net/COP4331?retryWrites=true&w=majority';
//const url = 'mongodb+srv://cop4331.njgcb.mongodb.net/COP4331" --username jason2992 --password WeLoveCOP4331';
const client = new MongoClient(url);
client.connect();

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
	 - addReq_Services
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
  // incoming: Competition, Teams array,  requied services
  // outgoing: error
	
  //const { team, req_services, start_time,end_time} = req.body;

  const newCompetition = {teams:[],req_services:[], start_time:"", end_time:"", join_code:""};
  
  var error = '';
  

  try
  {
    const db = client.db();
    const result = await db.collection('Competition').insertOne(newCompetition);
  }
  catch(e)
  {
    res.status(500).json({message : e.toString()})
  }

  var ret = { error: error };
  res.status(200).json(ret);
});



// ENDPOINT: Login
app.post('/api/login', async (req, res, next) => 
{
  // incoming: login, password
  // outgoing: id, firstName, lastName, error
	
 var error = '';

  const { username, password } = req.body;

  const db = client.db();
  const results = await db.collection('Competition').find({"teams.username": username, "teams.password":password}).toArray();

  //{$in{teams}}, {username:username,Password:password}

  var id = -1;
  var fn = '';
  var ln = '';

  if( results.length > 0 )
  {
    id = results[0].teams[0].name;
    fn = results[0].teams[0].instances;
    ln = results[0].teams[0].score;
  }

  var ret = { teamName:id, Instances:fn, Score:ln, error:''};
  res.status(200).json(ret);
});



// ENDPOINT: addTeam
//my idea here is that we are going to pass an array with all the teams with their information filled out.
app.post('/api/addTeam', async (req, res) => 
{
  // incoming: team,
  // outgoing: results[], error

  try{
    var error = '';

    const { teamObject, compID } = req.body;

    const db = client.db();

    const query = {};
    const updateDocument = {

    $push: {teams : teamObject}


    };

    // I'm thinking that the competion is the collection here and that the team object is going to be a document
    const results =  await db.collection('Competition').updateOne(query, updateDocument);


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
app.post('/api/createMachine', async(req, res) => {

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
    const results = await db.collection('Competition').find({"teams.name": teamName}).toArray();
    
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


// db.test_invoice.update({user_id : 123456 , "items.item_name":"my_item_one"} , {$inc: {"items.$.price": 10}})

// Basic server stuff
app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});

