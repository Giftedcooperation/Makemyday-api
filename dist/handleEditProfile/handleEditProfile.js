const handleEditProfile = function (req, res, User) {
  User.updateOne({
    email: req.body.email
  }, {
    $set: { ...req.body
    }
  }, (err, response) => {
    if (err) {
      throw err
    }

    res.status(200).send({ ...req.body
    })
  })
}

module.exports = handleEditProfile
