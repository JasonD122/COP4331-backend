# Objects
```
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
```

# Endpoints
- /register
- /verifyEmail
- /login
- /logout
- /forgotPassword
- /changePassword
- /addCompetition
- /deleteCompetition
- /addTeam
- /addInstances
- /getRequiredMachines
- /statusHistory
- /updateService
- /ourMoney


## /register
```
{
  email: ""
  password: "",
}
```

### Response
```
{
  error: ""
}
```

## /verifyEmail
```
{
  email: "",  
  code: ""
}
```

### Response
```
{
  verified: boolean,
  error: ""
}
```


## /addCompetition 
```
{
  sid: "",
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
```

### Response
```
{
  joinCode: "8digitstring",
  error: ""
}
```


## /addTeam
```
{
  name: "",
  password: "",
  joinCode: "x7suIop6"
}
```

### Response
```
{
  sid: "",
  error: ""
}
```


## /login
```
{
  email: "",
  password: ""
}
```

### Response
```
{
  sid: "",
  error: ""
}
```


## /logout
```
{
  sid: ""
}
```

### Response
```
{
  error: ""
}
```


## /resetPassword
```
{
  email: ""
}
```

### Response
```
{
  error: ""
}
```


## /changePassword
```
{
  sid: "",
  password: ""
}
```

### Response
```
{
  error: "" 
}
```


## /getRequiredMachines
```
{
  joinCode: ""
  // or sid. If sid is found, it's used. Otherwise, you can use the joinCode
  // If no fields are passed, then the first competition is used
  sid: ""
}
```

### Response
```
{
  machines: [
    Machine
  ],
  error: ""
}
```


## /addInstances
```
{
  sid: "",
  machines: [
    {
      name: 'machine name',
      ip: 'ip string'
    }
  ]
}
```

### Response
```
{
  error: ""
}
```


## /statusHistory
```
{
  sid: "",
}
```

### Response
```
{
  error: "",
  teams: [
    {
      name: "Team Name",
      machines: [
        {
          name: "MachineName",
          ip: "192.168.1.1",
          services: [
            {
              name: "ServiceName",
              port: "69",
              upCount: 6,
              downCount: 9,
              history: [{
                time: DateTime,
                status: true/false
              }]
            }
          ]
        }
      ]
    },
  ]
}
```

## /updateService
```
{
  sid: "",
  team: "Exact team name",
  machine: "exact machine name",
  service: "Exact service name",
  status: true/false,
  timestamp: Date 
}
```

### Response
```
{
  error: ""
}
```

## /deleteCompetition
```
{
  sid: "",
  name: ""
}
```

### Response
```
{
  error: ""
}
```

## /verifyEmail
```
{
  email: "string",
  code: "string"
}
```

### Response
```
{
  error: "string",
  verified: boolean
}
```

## /ourMoney
```
{
  sid: ""
}
```

### Response
```
{
  sids: [
    "sid1",
    "sid2",...
  ] 
}
```
