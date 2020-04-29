const mongoose = require('mongoose')

const Schema = mongoose.Schema
const PSchema = new Schema({

  name: String,
  price: Number,
  description: String,
  imgUrl: String

})

module.exports = mongoose.model('ProductS', PSchema)
