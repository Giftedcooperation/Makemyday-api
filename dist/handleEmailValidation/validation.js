const handleValidation = function (req, res, User) {
  User.updateOne({
    _id: req.params.id
  }, {
    $set: {
      validMail: true
    }
  }, (err, response) => {
    if (err) {
      console.log(err.message);
    }

    res.status(200).send({
      'message': 'email has been validated'
    });
  });
};

module.exports = handleValidation;