const bcrypt = require('bcrypt')
const User = require('../user')
const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

// 載入餐廳json檔。
// 【../../】->退兩層；【./】->載入對象為檔案
const restaurantList = require('./restaurant.json')

// 定義使用者清單
const userList = [
  {
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', () => {
  // 建立第一位使用者
  bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(userList[0].password, salt))
    .then(hash =>
      User.create({
        email: userList[0].email,
        password: hash
      })
    )
    .then(user => {
      const userId = user._id
      const favoriteRestarants = []
      favoriteRestarants.push(restaurantList.results[0])
      favoriteRestarants.push(restaurantList.results[2])
      favoriteRestarants.push(restaurantList.results[4])

      // 建立第一位使用者，最愛餐廳
      return Promise.all(Array.from(
        { length: favoriteRestarants.length },
        (value, index) => Restaurant.create({
          name: favoriteRestarants[index].name,
          name_en: favoriteRestarants[index].name_en,
          category: favoriteRestarants[index].category,
          image: favoriteRestarants[index].image,
          location: favoriteRestarants[index].location,
          phone: favoriteRestarants[index].phone,
          google_map: favoriteRestarants[index].google_map,
          rating: Number(favoriteRestarants[index].rating),
          description: favoriteRestarants[index].description,
          userId: userId
        }))
      )
    })
    .then(() => {
      // 建立第二位使用者
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(userList[1].password, salt))
        .then(hash =>
          User.create({
            email: userList[1].email,
            password: hash
          })
        )
        .then(user => {
          const userId = user._id
          const favoriteRestarants = []
          favoriteRestarants.push(restaurantList.results[1])
          favoriteRestarants.push(restaurantList.results[3])
          favoriteRestarants.push(restaurantList.results[5])

          // 建立第二位使用者，最愛餐廳
          return Promise.all(Array.from(
            { length: favoriteRestarants.length },
            (value, index) => Restaurant.create({
              name: favoriteRestarants[index].name,
              name_en: favoriteRestarants[index].name_en,
              category: favoriteRestarants[index].category,
              image: favoriteRestarants[index].image,
              location: favoriteRestarants[index].location,
              phone: favoriteRestarants[index].phone,
              google_map: favoriteRestarants[index].google_map,
              rating: Number(favoriteRestarants[index].rating),
              description: favoriteRestarants[index].description,
              userId: userId
            }))
          )
        })
        .then(() => {
          console.log('done.')
          process.exit() // process.exit() 指「關閉這段 Node 執行程序」
        })
    })
})
