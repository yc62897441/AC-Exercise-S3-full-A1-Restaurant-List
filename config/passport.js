const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    // 清空上次錯誤訊息
    // req.session.messages = [] 作廢，沒在 users.js get('login) 中使用 req.session.messages

    // 將登入表單傳入的 email 存到 session 中
    req.session.email = req.body.email

    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('warning_msg', 'That email is not registered!')
          return done(null, false, { message: 'That email is not registered!' })
        }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              req.flash('warning_msg', 'Email or Password incorrect.')
              return done(null, false, { message: 'Email or Password incorrect.' })
            }
            return done(null, user)
          })
      })
      .catch(error => done(error, false))
  }))

  // 設定 Facebook 登入策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName'] // profileFields 設定是和 Facebook 要求開放的資料，我們要了兩種資料
  }, (accessToken, refreshToken, profile, done) => {
    // profile 獲得的臉書資訊
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) { return done(null, user) }

        const randomPassword = Math.random().toString(36).slice(-8)

        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => {
            // 第一種寫法(存入資料庫)
            User.create({
              name: name,
              email: email,
              password: hash
            })
              .then(user => done(null, user))
              .catch(error => done(error, false))
          })
      })
      .catch(error => done(error, false))
  }
  ))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => done(error, null))
  })
}
