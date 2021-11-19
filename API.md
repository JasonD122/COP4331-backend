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
- /editCompetition **this is bs**
- /addTeam
- /editTeam **this is bs**
- /addMachine
- /getRequiredMachines
- /statusHistory


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
  sid: "",
  error: ""
}
```

## /verifyEmail
```
{
  sid: "",  
  verifyCode: ""
}
```

### Response
```
{
  sid: "",
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
  email: "",
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


## /forgotPassword
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
  code: "",
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


## /addMachines
```
{
  sessionId: "",
  machines: [
    Machine
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
              history: {
                time: DateTime,
                status: true/false
              }
            }
          ]
        }
      ]
    },
  ]
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
