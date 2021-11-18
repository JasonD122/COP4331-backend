module.exports = function deleteTeamMember (req, res, next) {
	
	let error = '';

	try {
		const db = client.db();
	}
	catch (e) {
		error = e.toString();
	}
	
	let ret =	 {error:error};
	res.status(200).json(ret);

}
