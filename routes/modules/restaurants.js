const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')
const User = require('../../models/user')

// 檢視所有餐廳
router.get('/all', (req, res) => {
  const name = req.user.name
  Restaurant.find()
    .lean()
    .then(restaurants => {
      res.render('index(restaurants-all)', { restaurants: restaurants, name: name })
    })
    .catch(error => console.log(error))
})

// 搜尋功能，顯示符合搜尋結果之餐廳 route setting search bar output
router.get('/search', (req, res) => {
  const name = req.user.name
  let keyword = req.query.keyword
  Restaurant.find()
    .lean()
    .then(restaurants => {
      restaurants = restaurants.filter(element => element.name.toLowerCase().includes(keyword.toLowerCase()))
      // 如果有成功搜尋到結果，則清空回傳到search bar的字串
      if (restaurants.length > 0) {
        keyword = ''
      }
      res.render('index(restaurants-all)', { restaurants: restaurants, keyword: keyword, name: name })
    })
    .catch(error => console.log(error))
})

// 排序功能
router.get('/sorted', (req, res) => {
  const name = req.user.name
  // 餐廳排序參數
  const key = Object.keys(req.query)[0]
  const sorted = req.query[key]

  Restaurant.find()
    .lean()
    .sort({ [key]: sorted })  // "desc"
    .then(restaurants => {
      res.render('index(restaurants-all)', { restaurants: restaurants, name: name })
    })
    .catch(error => console.log(error))
})

// 檢視單一餐廳頁面
router.get('/:id', (req, res) => {
  const name = req.user.name
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('show-single(restaurants)', { restaurant: restaurant, name: name })
    })
    .catch(error => console.log(error))
})

// 新增單筆餐廳資料
router.post('/create', (req, res) => {
  const reqBody = req.body

  // 建立單筆餐廳資料
  const restaurant = new Restaurant({
    name: reqBody.name,
    name_en: reqBody.name_en,
    category: reqBody.category,
    image: reqBody.image,
    location: reqBody.location,
    phone: reqBody.phone,
    google_map: reqBody.google_map,
    rating: reqBody.rating,
    description: reqBody.description
  })
  // 儲存單筆餐廳資料至餐廳資料庫，並將該筆餐廳 ._id 儲存至 user.favoriteRestaurant
  restaurant.save()
    .then(restaurant => {
      const email = req.user.email
      User.findOne({ email })
        .then(user => {
          user.favoriteRestaurant.push(restaurant._id.toHexString())
          user.save()
        })
        .catch(error => console.log(error))
    })
    .then(() => res.redirect('../'))
    .catch(error => console.log(error))
})

// 更新單筆餐廳資料
// router.put('/update/:id', (req, res) => {
//   const id = req.params.id
//   const updateInfo = req.body
//   Restaurant.findById(id)
//     .then(restaurant => {
//       restaurant.name = updateInfo.name
//       restaurant.name_en = updateInfo.name_en
//       restaurant.category = updateInfo.category
//       restaurant.image = updateInfo.image
//       restaurant.location = updateInfo.location
//       restaurant.phone = updateInfo.phone
//       restaurant.google_map = updateInfo.google_map
//       restaurant.rating = updateInfo.rating
//       restaurant.description = updateInfo.description
//       restaurant.save()
//       res.redirect(`/restaurants/${id}`)
//     })
//     .catch(error => console.log(error))
// })

// 刪除單筆餐廳資料
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id
  const email = req.user.email
  User.findOne({ email })
    .then(user => {
      user.favoriteRestaurant.remove(id)
      user.save()
      res.redirect('/')
    })
    .catch(error => console.log(error))
  // Restaurant.findById(id)
  //   .then(restaurant => {
  //     restaurant.remove()
  //     res.redirect('/')
  //   })
  //   .catch(error => console.log(error))
})

module.exports = router
