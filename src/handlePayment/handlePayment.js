
// this module will handle the payment using the paystack
let PayStack = require('paystack-node')
let APIKEY = process.env.PAYSTACK_SECRET_KEY
const environment = process.env.NODE_ENV
const paystack = new PayStack(APIKEY, environment)
/**
 *handlePayment function
 * @param {Object} req , request from client
 * @param {Object} res  , response to user
 * @param {Constructor} User
 * @param {Function} uuidv4
 */
const handlePayment = function (req, res, User, uuidv4) {
  const _idd = req.body.id
  /**
   * find the user by id and execute the callback function
   */
  User.findById({ _id: _idd }, (err, user) => {
    // if an error throw it
    if (err) throw err
    // generate random unique id
    const verificationCode = uuidv4()
    // initialize payment
    const promise6 = paystack.initializeTransaction({
      reference: verificationCode, // verification number
      amount: req.body.totalPrice * 100, //  Naira ( amount is passed in kobo ( 1 Naira make 100 Kobo) )
      email: user.email
    })

    promise6.then(function (response) {
      // send payment page url to client, this will redirect user to payment page
      res.status(200).send({ paymentUrl: response.body.data.authorization_url })
      // after payment page url is sent  to client start checking if the user the has paid with an
      // interval of 1 minute
      var verifyChunk = setInterval(verifyPayment, 1000 * 60 * 1)
      /**
       * the verifyPayment function will check if the user has paid successfully
       */
      function verifyPayment () {
        const promise7 = paystack.verifyTransaction({
          reference: verificationCode
        })

        promise7.then(function (response) {
          // checking if the payment was successful
          if (response.body.data.status === 'success') {
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
              to: user.email,
              subject: 'Payment recieved',
              html: `<h1 style="color: royalblue;font-family: Verdana;font-size: 300%;">Makemyday</h1>
                <p style="font-size:15px;line-height:1.5em">Hi ${user.name}, <b>${req.body.name ? req.body.name : 'Someone'}</b> just contributed to your event by paying a sum of ₦${req.body.totalPrice} for ${req.body.totalQty} items needed for your event, you will recieve payment from Makemyday shortly</p>
          
              `

            }
            // send an email to user verify email account
            transporter.sendMail(helperfunction, (err, info) => {
              if (err) {
                // check if an error occur and log it to console
                console.log(err)
              }
            })
            if (req.body.email && req.body.email) {
              let transporter2 = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: process.env.GMAIL_USER,
                  pass: process.env.GMAIL_PASS
                }
              })

              let helperfnc = {

                from: '"Makemyday" <sunkanmiadewumi1@gmail.com',
                to: req.body.email,
                subject: 'Transaction successful',
                html: `<h1 style="color: royalblue;font-family: Verdana;font-size: 300%;">Makemyday</h1>
                <p style="font-size:15px;line-height:1.5em">Hi ${req.body.name}, <b>${user.name}</b> just recieved your payment of ₦${req.body.totalPrice}. Thank you for your contribution</p>
          
              `

              }
              // send an email to user verify email account
              transporter2.sendMail(helperfnc, (err, info) => {
                if (err) {
                // check if an error occur and log it to console
                  console.log(err)
                }
              })
            }

            // if payment is successfull then  should stop verification
            clearInterval(verifyChunk)
            // update the total price and quantity of the items needed for event
            user.eventSchedule.totalQty = user.eventSchedule.totalQty - req.body.totalQty
            user.eventSchedule.totalPrice = user.eventSchedule.totalPrice - req.body.totalPrice
            for (let i = 0; i < user.eventSchedule.items.length; i++) {
              for (let j = 0; j < req.body.cartItems.length; j++) {
                if (user.eventSchedule.items[i].item._id === req.body.cartItems[j].item._id) {
                  user.eventSchedule.items[i].price = user.eventSchedule.items[i].price - req.body.cartItems[j].price
                  user.eventSchedule.items[i].qty = user.eventSchedule.items[i].qty - req.body.cartItems[j].qty
                }
              }
            }
            // save the new items needed to database
            user.save().then((response) => {
              // checking if all items was purchased
              if (response.eventSchedule.totalQty <= 0 && response.eventSchedule.totalPrice <= 0) {
                // find the user by id and execute the callback
                User.findById({ _id: _idd }, (err, user_) => {
                  // throw error if it occurs
                  if (err) throw err
                  // push the event scheduled to user record
                  user_.record.push(response.eventSchedule)
                  // save to database
                  user_.save()
                })
              }
            })
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
      // stop verifing payment after 15 minutes
      setTimeout(stopVerification, 1000 * 60 * 15)
      // this function will stop verification of payment
      function stopVerification () {
        clearInterval(verifyChunk)
      }
    })
    // checking if there was any error during the proccess of payment
      .catch(function (error) {
        // log error to console
        console.log(error)
      // deal with error
      })
  })
}
// export function for further usage
module.exports = handlePayment
