// this module will update users eventSchedule details
/**
 * handleUpdateEvent
 * @param {Object} req
 * @param {Object} res
 * @param {Constructor} User
 */
const handleUpdateEvent = function (req, res, User) {
  // update the user eventSchedule field
  User.updateOne({ _id: req.params.id }, { $set: { eventSchedule: { ...req.body } } }, (err, result) => {
    // checking if errr occur
    if (err) throw err
    console.log(result)
    // send updated info
    res.status(200).send(result)
  })
}
// export function for further usage
module.exports = handleUpdateEvent
