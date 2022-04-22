const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth') // 驗證登入狀態

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')

router.use('/restaurants/', authenticator, restaurants)
router.use('/users', users)
router.use('/', authenticator, home)

module.exports = router
