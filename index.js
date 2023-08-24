const express = require('express')
const app = express()
const port = 5000

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/blog', (req, res) => {
  res.render('blog')
})

app.get('/bloghtml', (req, res) => {
  res.render('blog')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

