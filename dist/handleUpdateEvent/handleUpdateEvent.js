const handleUpdateEvent = function (req, res, User) {
  User.updateOne({
    _id: req.params.id
  }, {
    $set: {
      eventSchedule: { ...req.body
      }
    }
  }, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.status(200).send(result);
  });
};

module.exports = handleUpdateEvent;