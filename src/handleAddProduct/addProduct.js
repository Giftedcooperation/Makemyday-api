// function performs the insertion of products to the database
/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Constructor} Product
 */
const addProduct = function (req, res, Product) {
  // Create a new instance of a product
  const newProduct = new Product({
    ...req.body
  })
  // save product to database
  newProduct.save().then(result => {
    // send back the result which is the added product
    res.status(200).send(result)
  })
    .catch(err => {
      // if error, send back the error
      res.status(400).send({ error: err.message })
    })
}
// export this function for usage in another module
module.exports = addProduct
