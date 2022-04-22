const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/restaurant-list')
const db = mongoose.connection

// 連線異常，連線成功
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db
