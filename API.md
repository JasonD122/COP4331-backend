# Objects
class Machine {
	name: "MachineName",
	services: [
		Service
	]
}

class Service
{
	name: "ServiceName",
	port: 420
}

# Endpoints
- /register
- /verifyEmail
- /login
- /logout
- /forgotPassword
- /changePassword
- /addCompetition
- /deleteCompetition
- /editCompetition **this is bs**
- /addTeam
- /editTeam **this is bs**
- /addMachine
- /getRequiredMachines
- /statusHistory


## /register
{
	email: ""
	password: "",
}

### Response
{
	sessionId: "",
	error: ""
}

## /verifyEmail
{
	sessionId: "",	
	verifyCode: ""
}

### Response
{
	sessionId: "",
	error: ""
}


## /addCompetition 
{
	sessionId: "",
	name: "Team Name",
	maxTeams: 69,
	startTime: "yyyy-mm-ddThh:mm:ss",
	endTime: "yyyy-mm-ddThh:mm:ss",
	machines: [
		{
			name: "MachineName",
			services: [
				{
					name: "ServiceName",
					port: 420
				},...
			]
		},...
	]

}

### Response
{
	joinCode: "8digitstring",
	error: ""
}


## /addTeam
{
	name: "",
	email: "",
	password: "",
	joinCode: "x7suIop6"
}

### Response
{
	sessionId: "",
	error: ""
}


## /login
{
	email: "",
	password: ""
}

### Response
{
	error: ""
}


## /logout
{
	sessionId: ""
}

### Response
{
	error: ""
}


## /forgotPassword
{
	email: ""
}

### Response
{
	error: ""
}


## /changePassword
{
	code: "",
	password: ""
}

### Response
{
	error: ""	
}


## /getRequiredMachines
{
	joinCode: ""
}

### Response
{
	machines: [
		Machine
	],
	error: ""
}


## /addMachines
{
	sessionId: "",
	machines: [
		Machine
	]
}

### Response
{
	error: ""
}


## /statusHistory
{
	serviceId: "",
}

### Response
{
	error: "",
	machines: [
		{
			name: "MachineName",
			services: [
				{
					name: "ServiceName",
					upCount: 6,
					downCount: 9,
					history: {
						time: DateTime,
						status: true/false
					}
				}
			]
		}
	]
}



## /deleteCompetition
{
	sessionId: "",
	name: ""
}

### Response
{
	error: ""
}
