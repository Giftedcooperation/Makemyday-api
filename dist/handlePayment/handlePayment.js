let PayStack = require('paystack-node');

let APIKEY = process.env.PAYSTACK_SECRET_KEY;
const environment = process.env.NODE_ENV;
const paystack = new PayStack(APIKEY, environment);

const handlePayment = function (req, res, User, uuidv4) {
  const _idd = req.body.id;
  User.findById({
    _id: _idd
  }, (err, user) => {
    if (err) throw err;
    const verificationCode = uuidv4();
    const promise6 = paystack.initializeTransaction({
      reference: verificationCode,
      amount: req.body.totalPrice * 100,
      // 5,000 Naira (remember you have to pass amount in kobo)
      email: user.email
    });
    promise6.then(function (response) {
      res.status(200).send({
        paymentUrl: response.body.data.authorization_url
      });
      var verifyChunk = setInterval(verifyPayment, 1000 * 60 * 1);

      function verifyPayment() {
        const promise7 = paystack.verifyTransaction({
          reference: verificationCode
        });
        promise7.then(function (response) {
          console.log(response.body);

          if (response.body.data.status === 'success') {
            clearInterval(verifyChunk);
            console.log(user.eventSchedule.items.length);
            user.eventSchedule.totalQty = user.eventSchedule.totalQty - req.body.totalQty;
            user.eventSchedule.totalPrice = user.eventSchedule.totalPrice - req.body.totalPrice;

            for (let i = 0; i < user.eventSchedule.items.length; i++) {
              for (let j = 0; j < req.body.cartItems.length; j++) {
                if (user.eventSchedule.items[i].item._id === req.body.cartItems[j].item._id) {
                  user.eventSchedule.items[i].price = user.eventSchedule.items[i].price - req.body.cartItems[j].price;
                  user.eventSchedule.items[i].qty = user.eventSchedule.items[i].qty - req.body.cartItems[j].qty;
                }
              }
            }

            user.save().then(response => {
              console.log(response);
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      }

      setTimeout(stopVerification, 1000 * 60 * 15);

      function stopVerification() {
        console.log('stopped verification');
        clearInterval(verifyChunk);
      }
    }).catch(function (error) {
      console.log(error); // deal with error
    });
    console.log(verificationCode);
  });
};

module.exports = handlePayment;