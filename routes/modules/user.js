const express = require('express')
const router = express.Router()

const User = require('../../models/user')
const Restaurant = require('../../models/restaurant')

// 檢視使用者最愛餐廳
router.get('/', (req, res) => {
  // 使用者 ID
  const { name, email } = req.user

  User.findOne({ email })
    .then(user => {
      const favoriteRestaurants = user.favoriteRestaurant
      Restaurant.find()
        .lean()
        .then(restaurants => {
          restaurants = restaurants.filter(restaurant => favoriteRestaurants.includes(restaurant._id))
          res.render('index(user)', { restaurants: restaurants, name: name })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

// 檢視單一餐廳頁面
router.get('/restaurant/:id', (req, res) => {
  const name = req.user.name
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('show-single(user)', { restaurant: restaurant, name: name })
    })
    .catch(error => console.log(error))
})

// 新增單一餐廳資料到 user.favoriteRestaurant
router.post('/favorite/:id', (req, res) => {
  const id = req.params.id
  const email = req.user.email
  User.findOne({ email })
    .then(user => {
      if (user.favoriteRestaurant.includes(id)) {
        return res.redirect('/')
      }
      user.favoriteRestaurant.push(id)
      user.save()
      res.redirect('/')
    })
    .catch(error => console.log(error))
})

// 搜尋功能，顯示符合搜尋結果之餐廳 route setting search bar output
router.get('/search', (req, res) => {
  const { name, email } = req.user
  let keyword = req.query.keyword

  User.findOne({ email })
    .then(user => {
      const favoriteRestaurants = user.favoriteRestaurant
      let favoriteRestaurantList = []
      if (favoriteRestaurants.length === 0) {
        return res.render('index(user)', { keyword: keyword, name: name })
      }
      Restaurant.find()
        .lean()
        .then(restaurants => {
          restaurants.forEach(restaurant => {
            if (favoriteRestaurants.includes(restaurant._id)) {
              favoriteRestaurantList.push(restaurant)
            }
          })

          favoriteRestaurantList = favoriteRestaurantList.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()))
          // 如果有成功搜尋到結果，則清空回傳到search bar的字串
          if (restaurants.length > 0) {
            keyword = ''
          }
          res.render('index(user)', { restaurants: favoriteRestaurantList, keyword: keyword, name: name })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

// 排序功能
router.get('/sorted', (req, res) => {
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
      res.render('index(user)', { restaurants: favoriteRestaurants, name: name })
    })
    .catch(error => console.log(error))
})

module.exports = router
