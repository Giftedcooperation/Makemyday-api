const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const scheduleSchema = new Schema({
  eventName: String,
  eventDate: String,
  items: [
    {
      item: Object,
      price: Number,
      qty: Number
    }
  ],
  totalPrice: Number,
  totalQty: Number

}, { minimize: false })
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  bankName: {
    type: String,
    required: false
  },
  accountNumber: {
    type: Number,
    required: false
  },
  getMail: {
    type: String,
    required: false
  },
  validMail: {
    type: Boolean,
    default: false,
    required: false
  },
  cart: {
    type: Object,
    required: false
  },

  eventSchedule: {
    type: scheduleSchema,
    required: false
  },
  record: {
    type: Array,
    required: false
  }

})

UserSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
}
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
