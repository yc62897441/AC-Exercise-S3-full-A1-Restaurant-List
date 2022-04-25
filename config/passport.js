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
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) { return done(null, false, { message: 'That email is not registered!' }) }
        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, {
                message: 'Email or Password incorrect.'
              })
            }
            return done(null, user)
          })
      })
      .catch(error => done(error, false))
  }))

  // 設定 Facebook 登入策略
  passport.use(new FacebookStrategy({
    clientID: '2296561663829376',
    clientSecret: '80f205ef9ae10eef548f283701be3e6b',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['email', 'displayName']  // profileFields 設定是和 Facebook 要求開放的資料，我們要了兩種資料
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
