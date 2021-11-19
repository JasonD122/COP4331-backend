module.exports = function addInstances (server, req, res, next) {

  // incoming: sid, instances
  // outgoing:  error

const {instances, sid} = req.body;
	let error = '';
  const dbm= server.dbm

  //User much be from a team
  const user = server.authedUser;

	try {
	

    const update = dbm.teams.updateOne({_id: user.inst}, {
      
      $set :{
        instances
    }
  });

	}
	catch (e) {
		error = e.toString();
	}

	let ret = {error:error};
	res.status(200).json(ret);

}

