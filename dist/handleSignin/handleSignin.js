const handleSignin = function (req, res, User) {
  const {
    emailForLogin: email,
    passwordForLogin: password
  } = req.body;

  const checkuser = function (user) {
    if (!user) {
      return res.status(400).send({
        error: 'No user with this email'
      });
    }

    if (!user.validMail) {
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
        subject: 'Email verification',
        html: `<h1 style="color: royalblue;font-family: Verdana;font-size: 300%;">Planna</h1>
          <p>Welcome to Planna, thank you for signing up with us. Please click on the button below to confirm your email account </p>
     <a style="color:white" href="http://192.168.43.164:5000/devapi/v1/validate-email/${user._id}"><button style="color:white;padding:20px; border:none; border-radius:5px; background:royalblue; font-size:15px; font-weight:bold;">Confirm Email</button></a>
        `
      };
      transporter.sendMail(helperfunction, (err, info) => {
        if (err) {
          console.log(err);
        }

        console.log(info);
      });
      return res.status(400).send({
        error: 'Please validate your email, a message has been sent to your mail'
      });
    }

    checkpassword(user);
  };

  const checkpassword = function (user) {
    if (!user.comparePassword(password)) {
      return res.status(400).send({
        error: 'invalid password, check password and try again'
      });
    }

    res.status(200).send(user);
  };

  User.findOne({
    email
  }).then(user => {
    checkuser(user);
  }).catch(err => {
    res.status(500).send({
      error: err.message
    });
  });
};

module.exports = handleSignin;