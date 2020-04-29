const handleSignup = function (req, res, User) {
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user && user.validMail) {
      console.log(user);
      return res.status(400).send({
        error: 'Email has been used by someone else'
      });
    }

    const newUser = new User({ ...req.body
    });
    newUser.password = newUser.hashPassword(newUser.password);
    newUser.save().then(user => {
      console.log(user);

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
    }).catch(err => {
      console.log(err);
    });
    user = { ...req.body
    };
    res.send({
      isAvailable: true,
      message: 'A message has been sent to your email, please check it out to validate your email account'
    });
  });
};

module.exports = handleSignup;