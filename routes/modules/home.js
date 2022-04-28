const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  // 使用者 ID
  const userId = req.user._id
  const userName = req.user.name

  Restaurant.find({ userId: userId })
    .lean()
    .then(restaurants => {
      res.render('index', { restaurants: restaurants, name: userName })
    })
})

// 排序功能
router.get('/sort', (req, res) => {
  // 使用者 ID
  const userId = req.user._id
  const userName = req.user.name
  // 餐廳排序參數
  const key = Object.keys(req.query)[0]
  const sorted = Number(req.query[key])

  Restaurant.find({ userId: userId })
    .lean()
    .sort({ [key]: sorted })
    .then(restaurants => {
      res.render('index', { restaurants: restaurants, name: userName })
    })
})

router.get('/search', (req, res) => {
  // 使用者 ID
  const userId = req.user._id
  const userName = req.user.name
  // 搜尋參數
  const keyword = req.query.keyword.toLowerCase()

  Restaurant.find({ userId: userId })
    .lean()
    .then(restaurants => {
      restaurants = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword))
      res.render('index', { restaurants: restaurants, name: userName })
    })
})

module.exports = router
