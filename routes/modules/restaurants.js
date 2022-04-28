const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 檢視單一餐廳頁面
router.get('/:id', (req, res) => {
  const userName = req.user.name
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('show-single', { restaurant: restaurant, name: userName })
    })
    .catch(error => console.log(error))
})

// 新增單筆餐廳資料
router.post('/create', (req, res) => {
  // 使用者 ID
  const userId = req.user._id

  // 表單回傳新增餐廳資訊
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
    description: reqBody.description,
    userId: userId
  })
  // 儲存單筆餐廳資料至餐廳資料庫，並將該筆餐廳 ._id 儲存至 user.favoriteRestaurant
  restaurant.save()
    .then(() => res.redirect('../'))
    .catch(error => console.log(error))
})

// 更新單筆餐廳資料
router.put('/update/:id', (req, res) => {
  const id = req.params.id
  const updateInfo = req.body
  Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = updateInfo.name
      restaurant.name_en = updateInfo.name_en
      restaurant.category = updateInfo.category
      restaurant.image = updateInfo.image
      restaurant.location = updateInfo.location
      restaurant.phone = updateInfo.phone
      restaurant.google_map = updateInfo.google_map
      restaurant.rating = updateInfo.rating
      restaurant.description = updateInfo.description
      restaurant.save()
      res.redirect(`/restaurants/${id}`)
    })
    .catch(error => console.log(error))
})

// 刪除單筆餐廳資料
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id

  Restaurant.findById(id)
    .then(restaurant => {
      restaurant.remove()
        .then(() => {
          res.redirect('/')
        })
    })
    .catch(error => console.log(error))
})

module.exports = router
