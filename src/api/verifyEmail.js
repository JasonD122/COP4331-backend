module.exports = async function verifyEmail(server, req, res, next) {
  const dbm = server.dbm;
  const body = req.body;
  const email = body.email;
  const code = body.code;

  const verif = await dbm.emailVerif.findOne({ code });

  if (!verif) {
    res.status(200).json({ error: "Not found", verified: false });
    return;
  }

  const user = await dbm.users.findOne({ _id: verif.user });

  if (!user) {
    res.status(200).json({ error: "No user found", verified: false });
    return;
  }

  if (user.email !== email) {
    res.status(200).json({ error: "Emails don't match", verified: false })
    return;
  }

  await dbm.users.updateOne(
    { _id: verif.user },
    { $set: { isVerified: true } }
  ); 

  await dbm.emailVerif.deleteOne({ _id: verif._id });
  res.status(200).json({ error: "", verified: true });
}
