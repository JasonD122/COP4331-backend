module.exports = async function testAuthorize (req, res, next, params) {
  let authedUser = params.authedUser;
  console.log(`Got: ${authedUser}`);
  if (authedUser) {
    console.log(`Successful authorization: username=${authedUser.username}, id=${authedUser._id}`);
    res.status(200).json({"error": "", "username": authedUser.username});
  }
  else {
    res.status(500).json({"error": "shit"});
  }
}
