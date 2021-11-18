module.exports = async function getScore (req, res) {
	
	let error = '';
  const { teamName } = req.body;
	try {
		const db = client.db();
    const results = await db.collection('Teams').find({"teamName": teamName}).toArray();
    
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

}
