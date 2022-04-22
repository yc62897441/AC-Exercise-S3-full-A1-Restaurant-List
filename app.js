// require packages used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

// 載入自定義套件
const Restaurant = require('./models/restaurant')
const routes = require('./routes/index')

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

// 連線總伺服器
app.use(routes)

// 啟動監聽server
app.listen(port, () => {
  console.log(`Serve is listening on http://localhost:${port}`)
})
