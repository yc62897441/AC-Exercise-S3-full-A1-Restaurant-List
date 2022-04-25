const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  favoriteRestaurant: {
    type: Array
  }
})

module.exports = mongoose.model('User', UserSchema)
