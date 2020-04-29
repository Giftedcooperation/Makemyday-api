// this module will handle the signing in of user
/**
 *handleSignin function
 * @param {Object} req
 * @param {Object} res
 * @param {Contructor} User
 */
const handleSignin = function (req, res, User) {
  // destructure the req.body object
  const { emailForLogin: email, passwordForLogin: password } = req.body
  // this function will validate the user signing in
  const checkuser = function (user) {
    // chack if user email exists or not
    if (!user) {
      // send a response telling client n user with the email sent
      return res.status(400).send({ error: 'No user with this email' })
    }
    // check is the email of the user is not valid
    if (!user.validMail) {
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
        to: email,
        subject: 'Email verification',
        html: `<h1 style="color: royalblue;font-family: Verdana;font-size: 300%;">Makemyday</h1>
          <p>Welcome to Makemyday. Please click on the button below to confirm your email account </p>
     <a style="color:white" href="https://mmdapi.herokuapp.com/devapi/v1/validate-email/${user._id}"><button style="color:white;padding:20px; border:none; border-radius:5px; background:royalblue; font-size:15px; font-weight:bold;">Confirm Email</button></a>
        `

      }
      // send an email to user verify email account
      transporter.sendMail(helperfunction, (err, info) => {
        if (err) {
          // check if an error occur and log it to console
          console.log(err)
        }
      })
      //  send a response to user asking him or her to validate email
      return res.status(400).send({ error: 'Please validate your email, a message has been sent to your mail' })
    }
    // execute function validate users passsword
    checkpassword(user)
  }
  // this function validate a user password
  const checkpassword = function (user) {
    // compare entered password with password from database
    if (!user.comparePassword(password)) {
      // send a response to user that email is invalid
      return res.status(400).send({ error: 'invalid password, check password and try again' })
    }
    // if user passes all validation the send the user information back
    res.status(200).send(user)
  }
  // find user with entered email
  User.findOne({ email }).then((user) => {
    // validate user
    checkuser(user)
  })
  // check if there is an error
    .catch(err => {
      // send error to user
      res.status(500).send({ error: err.message })
    })
}
// export function for further usage
module.exports = handleSignin
