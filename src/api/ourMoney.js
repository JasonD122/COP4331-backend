module.exports = async function ourMoney(server, req, res, next) {
  const dbm = server.dbm;
  const user = server.authedUser;
  let object=[];
  let sids=[];

  if (user.type !== 'admin') {
    res.status(400).json({ error: "Only admin can use this" });
    return;
  }

  const comp = await dbm.competitions.findOne({ _id: user.inst });

  if (!comp) {
    res.status(200).json({ error: "someone fucksiwupsy" });
    return;
  }

  console.log(comp.teams);

  const userIds = (await dbm.users.find(
    { inst: { $in: comp.teams } },
  ).toArray()).map(o => o._id);


  const teamNames = (await dbm.teams.find({_id:{$in:comp.teams}}
    ).toArray()).map(o => o.name);


    
    
   // const sids = (await dbm.sessions.find(
     // { user: { $in: userIds } }
      //).toArray()).map(o => o.sid);

      for (let index = 0; index < userIds.length; index++) {
            let sid = await dbm.sessions.findOne({user: userIds[index]});
            sids.push(sid.sid);       
      }
      
      
      for (let index = 0; index < sids.length; index++) {
            let obj = {sid:sids[index],
            teamName:teamNames[index]};
            object.push(obj);
        }
        
        

  res.status(200).json({ error: "", object });
}
