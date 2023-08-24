
const express = require('express')
const app = express()
const port = 5000
const path = require('path')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'assets/views'))
// set serving static file
app.use(express.static('assets'))

app.use(express.urlencoded({ extended: false }))



const home = (req, res) => {
  res.render('index')
}
const blog = (req, res) => {
  res.render('blog')
}
const contact = (req, res) => {
  res.render('contact')
}


app.get('/', home)
app.get('/blog', blog)
app.get('/contact', contact)
app.post('/blog', addContentBlog)


function addContentBlog(req, res){
let  {projectName, startDate, endDate, description} = req.body

console.log("data: ", projectName, startDate, endDate, description)

  res.redirect('/blog')
}
