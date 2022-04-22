const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../../models/user')
const { application } = require('express')

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

// 處理登入資訊
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

// 處理註冊資訊
router.post('/register', (req, res) => {
  const { email, password, confirmPassword } = req.body

  User.findOne({ email })
    .lean()
    .then(user => {
      if (user) {
        console.log('The email have already been registered.')
        return res.render('register', { email, password, confirmPassword })
      }
      if (password !== confirmPassword) {
        console.log('The password doesn\'t match the confirmPassword.')
        return res.render('register', { email, password, confirmPassword })
      }
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({
            email: email,
            password: hash
          })
          res.render('login')
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router
