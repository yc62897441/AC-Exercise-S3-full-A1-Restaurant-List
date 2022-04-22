const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../user')
const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

// 定義使用者清單
const userList = [
  {
    email: 'user1@example.com',
    password: '12345678',
    favoriteRestaurant: []
  },
  {
    email: 'user2@example.com',
    password: '12345678',
    favoriteRestaurant: []
  }
]

Restaurant.find()
  .lean()
  .then(restaurants => {
    userList[0]['favoriteRestaurant'].push(restaurants[0]._id.toHexString())
    userList[0]['favoriteRestaurant'].push(restaurants[2]._id.toHexString())
    userList[0]['favoriteRestaurant'].push(restaurants[4]._id.toHexString())

    userList[1]['favoriteRestaurant'].push(restaurants[1]._id.toHexString())
    userList[1]['favoriteRestaurant'].push(restaurants[3]._id.toHexString())
    userList[1]['favoriteRestaurant'].push(restaurants[5]._id.toHexString())
    console.log('userList:', userList)
  })
  .catch(error => console.log(error))

db.once('open', () => {
  userList.forEach(user => {
    bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash => {
        User.create({
          email: user.email,
          password: hash,
          favoriteRestaurant: user.favoriteRestaurant
        })
      })
  })
  console.log('DB Users created.')
})
