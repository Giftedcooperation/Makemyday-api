// this module will handle retrieval of a forgotten password
/**
 * handleForgotPassword function
 * @param {Object} req, request from client
 * @param {Object} res, response to client
 * @param {Constructor} User
 * @param {Object} bcrypt
 */
const handleForgotPassword = function (req, res, User, bcrypt) {
  const email = req.body.email
  // find user with email and execute the callback
  User.findOne({ email }, (err, user) => {
    // if error, throw the error
    if (err) throw err
    // check if  the email is not registered or not valid
    if (!user || !user.validMail) {
      return res.status(400).send({ error: 'This email is not registerd' })
    }
    const newPassword = `${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}${Math.floor(Math.random() * 100)}`
    // find the user with email then update password to generated password
    User.updateOne({ email }, { $set: { password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(5), null) } }, (err, response) => {
      // if error, throw the error
      if (err) throw err
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
        subject: 'New password',
        html: `<h1 style="color: royalblue;font-family: Verdana;font-size: 300%;">Makemyday</h1>
          <p>Your new Password is <b>${newPassword}</b></p>
    
        `

      }
      // send new password to clients email account
      transporter.sendMail(helperfunction, (err, info) => {
        if (err) {
          // if error, send the error to client
          return res.status(400).send(err)
        }
        // send the mail info from nodemailer to client
        res.status(200).send(info)
      })
    })
  })
}
// export function for further usage
module.exports = handleForgotPassword
