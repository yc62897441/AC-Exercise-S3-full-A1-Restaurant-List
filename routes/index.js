const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth') // 驗證登入狀態

const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const auth = require('./modules/auth')
const user = require('./modules/user')

router.use('/restaurants/', authenticator, restaurants)
router.use('/users', users)
router.use('/auth', auth)
router.use('/user', authenticator, user)
router.use('/', authenticator, home)

module.exports = router
