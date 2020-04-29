// function performs the fetching all products from the database
/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Constructor} Product
 */
const handleFetchProducts = function (req, res, Product) {
  // find all the products
  Product.find({}).exec((err, products) => {
    // if error, then throw it
    if (err) throw err
    // send back all the product
    res.status(200).send(products)
  })
}
// export the function for further usage
module.exports = handleFetchProducts
