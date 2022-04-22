const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  const key = Object.keys(req.query)[0]
  const sorted = req.query[key]

  Restaurant.find()
    .lean()
    .sort({ [key]: sorted }) // "desc"
    .then(restaurants => {
      res.render('index', { restaurants: restaurants })
    })
    .catch(error => console.log(error))
})

module.exports = router
