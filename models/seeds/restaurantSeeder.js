// 載入套件
const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

// 載入餐廳json檔。
// 【../../】->退兩層；【./】->載入對象為檔案
let restaurantList = require('./restaurant.json')
restaurantList = restaurantList.results

db.once('open', () => {
  restaurantList.forEach(element => {
    Restaurant.create({
      name: element.name,
      name_en: element.name_en,
      category: element.category,
      image: element.image,
      location: element.location,
      phone: element.phone,
      google_map: element.google_map,
      rating: Number(element.rating),
      description: element.description
    })
  })

  console.log('Data load in db done.')
})
