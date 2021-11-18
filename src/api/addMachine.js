module.exports = async function addMachine (req, res, next) {

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

}
