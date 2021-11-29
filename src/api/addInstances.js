module.exports = function addInstances (server, req, res, next) {

  // incoming: sid, instances
  // outgoing:  error

  let {instances, sid} = req.body;
	let error = '';
  const dbm= server.dbm

  //User much be from a team
  const user = server.authedUser;


  for (const inst of instances) {
    for (const service of inst.services) {
      service.status = false;
      service.history = [];
      service.upCount = 0;
      service.downCount = 0;
    }
  }

	try {
    dbm.teams.updateOne(
      { _id: user.inst }, 
      { $set :{instances} }
    );

	}
	catch (e) {
		error = e.toString();
	}

	let ret = {error:error};
	res.status(200).json(ret);

}

