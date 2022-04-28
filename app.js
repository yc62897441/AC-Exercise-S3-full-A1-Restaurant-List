// require packages used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const session = require('express-session')
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

// 內部自定義套件 & 定義伺服器參數
const app = express()
const port = process.env.PORT
require('./config/mongoose')
const routes = require('./routes/index')

// 設定【view engine】 setting template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

// 使用 app.use() 註冊套件，並使用 session(option) 來設定相關選項
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

app.use(flash())

// 設定本地變數 res.locals
// 放在 res.locals 裡的資料，所有的 view 都可以存取
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  // req.user 是在反序列化的時候，取出的 user 資訊，之後會放在 req.user 裡以供後續使用
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning_msg 訊息
  next()
})

// 連線總伺服器
app.use(routes)

// 啟動監聽server
app.listen(port, () => {
  console.log(`Serve is listening on http://localhost:${port}`)
})
