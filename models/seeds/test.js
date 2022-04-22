// 載入套件
const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

// 載入餐廳json檔。
// 【../../】->退兩層；【./】->載入對象為檔案
let restaurantList = require('./restaurant.json')
restaurantList = restaurantList.results

// console.log(restaurantList)

Restaurant.find()
  .lean()
  .then(restaurants => {
    console.log(restaurants)
  })
  .catch(error => console.log(error))