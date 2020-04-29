// this module will handle user signup
/**
 * handleSignup
 * @param {Object} req
 * @param {Object} res
 * @param {Object} User
 */
const handleSignup = function (req, res, User) {
  // find user with enterd email and executing the callback function
  User.findOne({ email: req.body.email }).then((user) => {
    // checking if email has been used
    if (user && user.validMail) {
      // send a response to user that email has been used
      return res.status(400).send({ error: 'Email has been used by someone else or you, try to login' })
    }
    // checking if there is a user but has not validated the email
    else if (user && !user.validMail) {
      User.deleteMany({ email: req.body.email }).then(results => {
        console.log(results)
      })
    }
    // checking the number of tries made by user
    if (req.body.retries > 0) {
      // find the previously added user and delete
      User.deleteMany({ email: req.body.email }).then(result => {
        console.log(result)
      })
    }
    // create new instance of User
    const newUser = new User({ ...req.body })
    // has password
    newUser.password = newUser.hashPassword(newUser.password)
    // save user to database
    newUser.save()
      .then((user) => {
        var nodemailer = require('nodemailer')
        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
        })

        let helperfunction = {

          from: '"Makemyday" <sunkanmiadewumi1@gmail.com',
          to: req.body.email,
          // https://accounts.google.com/b/0/DisplayUnlockCaptcha
          subject: 'Email verification',
          html: `<h1 style="color: royalblue;font-family: Verdana;font-size: 300%;">Makemyday</h1>
               <p>Welcome to Makemyday, thank you for signing up with us. Please click on the button below to confirm your email account </p>
          <a style="color:white" href="https://mmdapi.herokuapp.com/devapi/v1/validate-email/${user._id}"><button style="color:white;padding:20px; border:none; border-radius:5px; background:royalblue; font-size:15px; font-weight:bold;">Confirm Email</button></a>
          `

        }
        // send email to user to verify email
        transporter.sendMail(helperfunction, (err, info) => {
          // checking for error
          if (err) {
            // send a response to user that an error occured will sending mail
            return res.status(500).send({ error: 'Could not send mail check network connection' })
          }
          // send a response that an email has been sent to validate mail
          res.status(201).send({ isAvailable: true, message: 'A message has been sent to your email, please check it out to validate your email account' })
        })
      })
      // checking for errors
      .catch(err => {
        console.log(err)
      })
  })
}
// export function for further usage
module.exports = handleSignup
