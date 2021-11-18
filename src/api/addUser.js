module.exports = async function addUser (req, res, next) {

	let error = '';

	try {
		const db = client.db();
	}
	catch (e) {
		error = e.toString();
	}

	let ret = {error:error};
	res.status(200).json(ret);

}
