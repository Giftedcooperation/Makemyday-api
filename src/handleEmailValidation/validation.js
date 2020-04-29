// this module will handle the validation of an email
/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Constructor} User
 */
const handleValidation = function (req, res, User) {
  console.log('git her')
  // find the user with an id and update the validMail field to true
  User.updateOne({ _id: req.params.id }, { $set: { validMail: true } }, (err, response) => {
    if (err) {
      // if error then throw it
      res.status(400).send({ error: 'error' })
    }
    // send back an html page showing that the email has been validated
    res.status(200).send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Makemyday</title>
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
</head>
<body>
   <div class="cntainer" style="padding: 50px 30px; text-align: center;">
       <h1>
           Verification successful
       </h1>

       <a href="https://makemyday.netlify.app/signup"><button class="btn btn-primary" style=" font-size: 14px; color: white;font-weight: 600;">
         Back to login
       </button>
    </a>
   </div>
</body>
</html>`)
  })
}
// export the function for further consumption
module.exports = handleValidation
