const handleGetUser = function (req, res, User) {
  User.findById({
    _id: req.params.id
  }, 'name eventSchedule', (err, user) => {
    if (err) throw err;
    res.status(200).send(user);
  });
};

module.exports = handleGetUser;