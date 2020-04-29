const handleForgotPassword = function (req, res, User, bcrypt) {
  const email = req.body.email;
  User.findOne({
    email
  }, (err, user) => {
    if (err) throw err;

    if (!user || !user.validMail) {
      return res.status(400).send({
        error: 'This email is not registerd'
      });
    }

    const newPassword = `${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}`;
    console.log(newPassword);
    User.updateOne({
      email
    }, {
      $set: {
        password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(5), null)
      }
    }, (err, response) => {
      if (err) throw err;
      console.log(response);

      var nodemailer = require('nodemailer');

      let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'sunkanmiadewumi1@gmail.com',
          pass: 'Ayodeji00;'
        }
      });
      let helperfunction = {
        from: '"Planna" <sunkanmiadewumi1@gmail.com',
        to: 'sunkanmiadewumi477@gmail.com',
        subject: 'New password',
        html: `<h1 style="color: royalblue;font-family: Verdana;font-size: 300%;">Planna</h1>
          <p>Your new Password is <b>${newPassword}</b></p>
    
        `
      };
      transporter.sendMail(helperfunction, (err, info) => {
        if (err) {
          return res.status(400).send(err);
        }

        res.status(200).send(info);
      });
    });
  });
};

module.exports = handleForgotPassword;