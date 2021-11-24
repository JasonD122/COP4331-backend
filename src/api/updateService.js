module.exports = async function updateService (server, req, res, next) {

 
    // incoming: sid, team,service,status,timestamp,machine
    // outgoing:  error,
  
  const {sid,team,service,status,timestamp,machine } = req.body;
  let error = '';
  let userID,count, dateam;
  let instance = [];
  let checks =[];
  
  const dbm = server.dbm;

  let compe = await dbm.competitions.findOne();


  compe.teams.forEach(element => {

      count = instance.push(element);
      
  });

  console.log(instance);


  let counter1 = 0;

  while (counter1 < instance.length) {


    userID = await dbm.teams.findOne({_id : instance[counter1]});


    if (userID.name === team) {
        dateam = userID;
    }
    
    counter1++;
    
}
console.log(dateam.instances[0].services);


for (let index = 0; index < dateam.instances.length; index++) {

    if(dateam.instances[index].name === machine){
        for (let i = 0; i < dateam.instances[index].services.length; i++) {

            if(dateam.instances[index].services[i].name === service){

                const temp =  dateam.instances[index].services[i];

                temp.status = status;
                    if(status == true)
                        temp.upCount++;
                    
                    else
                        temp.downCount++;

                        if(temp.history.length < 5)
                            temp.history.unshift({status:status, timestamp:timestamp});

                        else{
                            temp.history.pop();
                            temp.history.unshift({status:status, timestamp:timestamp});


                        }

                    
            }
            
        }

    }
    

    
}


console.log(dateam);


    let confirm = await dbm.teams.updateOne({_id:dateam._id}, { $set:{ instances:dateam.instances}});


  ret = {error:error}


  res.status(200).json(ret);
  
}  