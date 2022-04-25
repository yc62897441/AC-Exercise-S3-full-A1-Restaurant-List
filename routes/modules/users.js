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
  const { email, name, password, confirmPassword } = req.body

  const errors = []
  if (!email || !passport || !confirmPassword) {
    errors.push({ message: '請填寫 Email, Passport, ConfirmPassword 欄位' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符' })
  }
  if (errors.length) {
    return res.render('register', { email, name, password, confirmPassword, errors })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message: 'Email 已經被註冊過' })
        return res.render('register', { email, name, password, confirmPassword, errors })
      }

      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({
            email: email,
            name: name,
            password: hash
          })
            .then(() => {
              res.render('login')
            })
            .catch(error => console.log(error))
        })
    })
})

// 登出
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router
