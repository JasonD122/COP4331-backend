module.exports = async function ourMoney(server, req, res, next) {
  const dbm = server.dbm;
  const user = server.authedUser;

  if (user.type !== 'admin') {
    res.status(400).json({ error: "Only admin can use this" });
    return;
  }

  const comp = await dbm.competitions.findOne({ _id: user.inst });

  if (!comp) {
    res.status(200).json({ error: "someone fucksiwupsy" });
    return;
  }

  const userIds = (await dbm.users.find(
    { inst: { $in: comp.teams } },
  ).toArray()).map(o => o._id);

  const sids = (await dbm.sessions.find(
    { user: { $in: userIds } },
    { sid: 1 },
  ).toArray()).map(o => o.sid);

  res.status(200).json({ error: "", sids });
}
