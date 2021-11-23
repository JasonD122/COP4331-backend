module.exports = async function logout(server, req, res, next) {
  const { sid } = req.body;

  server.session.deleteSession(sid);
  res.status(200).json({ error: "" });
}
