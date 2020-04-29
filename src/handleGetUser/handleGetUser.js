// thismodule will handle finding of one user
/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Constructor} User
 */
const handleGetUser = function (req, res, User) {
  // find a user by id projection of name and the schedule
  User.findById({ _id: req.params.id }, 'name eventSchedule', (err, user) => {
    // if an error occured, throw it
    if (err) throw err
    // send back the user
    res.status(200).send(user)
  })
}
// export the function for further usage
module.exports = handleGetUser
