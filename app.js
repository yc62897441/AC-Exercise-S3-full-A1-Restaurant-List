// require packages used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const session = require('express-session')
const flash = require('connect-flash')

// 載入自定義套件

const routes = require('./routes/index')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

// 定義伺服器參數
const app = express()
const port = 3000
require('./config/mongoose')

// 設定【view engine】 setting template engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

// 使用 app.use() 註冊套件，並使用 session(option) 來設定相關選項
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

app.use(flash())

// 連線總伺服器
app.use(routes)

// 啟動監聽server
app.listen(port, () => {
  console.log(`Serve is listening on http://localhost:${port}`)
})
