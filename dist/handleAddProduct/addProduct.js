const addProduct = function (req, res, Product) {
  const newProduct = new Product({ ...req.body
  });
  newProduct.save().then(result => {
    res.status(200).send(result);
  }).catch(err => {
    res.status(400).send({
      error: err.message
    });
  });
};

module.exports = addProduct;