const handleFetchProducts = function (req, res, Product) {
  Product.find({}).exec((err, products) => {
    if (err) throw err;
    res.status(200).send(products);
  });
};

module.exports = handleFetchProducts;