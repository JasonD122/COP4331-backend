module.exports = async function changePassword(server, req, res, next) {
  const dbm = server.dbm;
  const user = server.authedUser;

  const { password } = req.body;

  const update = await dbm.users.updateOne(
    { _id: user._id },
    { $set: { password} },
  );

  if (update.matchedCount === 0) {
    res.status(200).json({ error: "No user found" });
  }
  else if (update.modifiedCount === 0) {
    res.status(200).json({ error: "Unable to update password for unknown reasons" });
  }
  else {
    res.status(200).json({ error: "" });
  }
}

