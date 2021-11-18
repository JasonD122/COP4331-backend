module.exports = function addReqServices (req, res, next) 
{
  // incoming: req_Service object arrqay
  // outgoing: results[], error

  var error = '';

  const { req_ServiceObject } = req.body;


  const db = client.db();

  // I'm thinking that the competion is the collection here and that the team object is going to be a document
  const results = await db.collection('competition').updateone("req_services",req_ServiceObject);
  
  var _ret = [];
  for( var i=0; i<results.length; i++ )
  {
    _ret.push( results[i].Card );
  }
  
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
}
