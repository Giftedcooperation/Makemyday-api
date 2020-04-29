// thismodule will handle the editing of a users profile
/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Constructor} User
 */
const handleEditProfile = function (req, res, User) {
  // find the user with email and update then execute the callback function
  User.updateOne({ email: req.body.email }, { $set: { ...req.body } }, (err, response) => {
    if (err) {
      // throw an errr if it occurs
      throw err
    }
    // send back the updated user
    res.status(200).send({ ...req.body })
  })
}
// export the function for further usage
module.exports = handleEditProfile
