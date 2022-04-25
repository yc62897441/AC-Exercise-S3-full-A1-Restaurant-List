const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')
const User = require('../../models/user')

router.get('/', (req, res) => {
  // 使用者 ID
  const userId = req.user._id
  // 餐廳排序參數
  const key = Object.keys(req.query)[0]
  const sorted = req.query[key]

  // 找出使用者資料
  User.findOne({ _id: userId })
    .lean()
    .then(user => {
      // 使用者「最愛餐廳」清單
      const favoriteRestaurants = []
      const name = user.name

      // 依據使用者資料(user.favoriteRestaurant)，從餐廳資料(Restaurant)中找出相對應的餐廳，並加入使用者「最愛餐廳」清單(favoriteRestaurants)
      user.favoriteRestaurant.forEach(restaurantId => {
        Restaurant.findOne({ _id: restaurantId })
          .lean()
          .then(restaurant => {
            favoriteRestaurants.push(restaurant)
          })
          .then(() => {
            // 餐廳排序函式
            function restaurantSort(key, sorted, favoriteRestaurants) {
              let sortDirection = 1
              if (sorted === 'desc') {
                sortDirection = -1
              }
              favoriteRestaurants.sort(function (a, b) {
                const nameA = a[key]
                const nameB = b[key]
                if (nameA < nameB) {
                  return -1 * sortDirection;
                }
                if (nameA > nameB) {
                  return 1 * sortDirection;
                }
                // names must be equal
                return 0;
              })
            }

            // 進行餐廳排序
            switch (key) {
              case 'name':
                restaurantSort(key, sorted, favoriteRestaurants)
                break
              case 'category':
                restaurantSort(key, sorted, favoriteRestaurants)
                break
              case 'rating':
                restaurantSort(key, sorted, favoriteRestaurants)
                break
            }
          })
      })
      res.render('index', { restaurants: favoriteRestaurants, name: name })
    })
    .catch(error => console.log(error))
})

module.exports = router
