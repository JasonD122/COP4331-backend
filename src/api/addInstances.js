module.exports = function addInstances (req, res, next) 
{
  // incoming: instances object arrqay
  // outgoing: res:200, error

  var error = '';

  const { InstanceObject , tname } = req.body;


  const db = client.db();

  await db.collection('competition').updateone({"teams.name":tname}, {$set:{ 'teams.$.instances':InstanceObject}});
  
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
}
