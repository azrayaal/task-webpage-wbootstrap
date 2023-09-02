
const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// sequelize setup
const config = require('./src/config/config.json')
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(config.development)

// setup flash
app.use(flash())

// setup session
app.use(session({
  cookie:{
    httpOnly: true, 
    secure: false,
    maxAge: 1000 * 60 * 60 * 2
  },
  store: new session.MemoryStore(),
  saveUninitialized: true,
  resave: false,
  secret: 'secretValue'
}))


// call ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))

// set serving static file
app.use(express.static('src/assets'))
app.use(express.static('src/uploads'))
// Middleware
app.use(express.urlencoded({ extended: false }))


//////////////////  ROUTER  ////////////////////////////////
// home
app.get('/', home)
app.get('/logout', logOut)
// register
app.get('/register', viewRegister)
app.post('/register', register)
// login
app.get('/login', viewLogin)
app.post('/login', login)
// blog
app.get('/blog', viewFormBlog)
app.post('/blog', addContentBlog)
app.get('/blog-detail/:id', viewBlogDetail)
app.get('/blog-edit/:id', viewBlogEdit)
app.post('/blog-edit/:id', blogEdit)
app.get('/blog-delete/:id', blogDelete)
// contact
app.get('/contact', contact)
app.post('/contact', sendContact)

//////////////////  FUNCTION  ////////////////////////////////
///////////////  HOME  /////////////// 
async function home(req, res){ 
  try {
    const query = `SELECT * FROM blog`
    let dataBlogs = await sequelize.query(query, {type: QueryTypes.SELECT})

    const isLogin = req.session.isLogin
    const username = req.session.user

    res.render('index', {
      title: 'Home Page', 
      blogData: dataBlogs,
      isLogin: req.session.isLogin,
      user: req.session.user
    })
    console.log('==========================================');
    console.log('isLogin at homepage: ', isLogin, username);
    console.log('==========================================');
  } catch (error) {
    console.log('==========================================');
    console.log('error from HOME PAGE: ', error);
    console.log('==========================================');
  }
}
///////////////  REGISTER  ///////////////
function viewRegister(req, res){
  res.render('register', {title: 'Register Page' })
}
async function register(req, res){
  try {
    const {name, email, password} = req.body
    const saltRound = 10

    await bcrypt.hash(password, saltRound, (err, hassPassword)=>{
      const query = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hassPassword}')`
      sequelize.query(query)
      req.flash('succes', 'Register is successful')
    })
    res.redirect('/login')
 
  } catch (error) {
    console.log('==========================================');
    console.log('error from REGISTER PAGE: ', error);
    console.log('==========================================');
  }
}
///////////////  LOGIN  ///////////////
function viewLogin(req, res){
  res.render('login', {title: 'Login Page'})
}
async function login(req, res){
  try {
    const {email, password} = req.body
    const query = `SELECT * FROM users WHERE email = '${email}'`

    const dataUsers = await sequelize.query(query, {type: QueryTypes.SELECT})
// cek email
    if(!dataUsers.length){
      req.flash('danger', 'Email has not been registered!')
    }
// cek password
    await bcrypt.compare(password, dataUsers[0].password, (err, isMatch)=>{
      if(!isMatch){
        req.flash('danger', 'Sorry, your password is wrong')
      } else {
        const isLogin = req.session.isLogin = true
        isLogin
        // req.session.isLogin = true
        const username = req.session.user = dataUsers[0].name
        username
        // req.session.user = dataUsers[0].name
        req.flash('succes', 'Login successful')
       
        // console.log('==========================================');
        // console.log('req.session.isLogin : ', isLogin, username);
        // console.log('==========================================');
        res.redirect('/')
      }
    })
  } catch (error) {
    console.log('==========================================');
    console.log('error from LOGIN PAGE: ', error);
    console.log('==========================================');
  }
}
///////////////  BLOG  ///////////////
function logOut(req, res){
  req.session.destroy()
  res.redirect('/login')
}
///////////////  BLOG  ///////////////
function viewFormBlog(req, res){
  res.render('blog', {
    title: 'Blog Page',
    isLogin: req.session.isLogin,
    user: req.session.user
  })
}
async function addContentBlog(req, res){
  try {
  const {title, content, technologies, start_date, end_date} = req.body
  const image = '/img/katheryne-card.png'

  await sequelize.query(`INSERT INTO blog (title, content, technologies, start_date, end_date, image) VALUES ('${title}', '${content}', ARRAY ['${technologies}'], '${start_date}', '${end_date}', '${image}')`)
  
  res.redirect('/')
  } catch (error) {
    console.log('==========================================');
    console.log('error from PROCESS ADD CONTENT: ', error);
    console.log('==========================================');
  }
}
async function viewBlogDetail(req, res){
  try {
   const {id} = req.params
   const query = `SELECT * FROM blog WHERE id = ${id}`

   const blog = await sequelize.query(query, {type: QueryTypes.SELECT})

   const data = blog.map(item =>({
    ...item
   }))

   res.render('blog-detail', {
    title: 'Blog Detail Page', 
    blog: data[0],
    isLogin: req.session.isLogin,
    user: req.session.user
   })

  } catch (error) {
    console.log('==========================================');
    console.log('error from PROCESS Blog Detail Page: ', error);
    console.log('==========================================');
  }
}
async function viewBlogEdit(req, res){
  try {
    const {id} = req.params
    const query = `SELECT * FROM blog WHERE id = ${id}`

    const blog = await sequelize.query(query, {type: QueryTypes.SELECT})

    const data = blog.map((item)=>({
      ...item
    }))

    res.render('blog-edit', {
      title: 'Blog Edit', 
      editBlog: data[0],
      isLogin: req.session.isLogin,
      user: req.session.user
  })
    
  } catch (error) {
    console.log('==========================================');
    console.log('error from PROCESS Blog Edit Page: ', error);
    console.log('==========================================');
  }
}
async function blogEdit(req, res){
  try {
    const {id} = req.params
    const {title, start_date, end_date, technologies} = req.body

    await sequelize.query(`UPDATE blog SET title= '${title}', start_date= '${start_date}', end_date= '${end_date}' WHERE id= '${id}'`)

    req.flash('success', 'Blog successfuly updated')
    res.redirect('/')
  } catch (error) {
    console.log('==========================================');
    console.log('error from PROCESS Blog Edit Process: ', error);
    console.log('==========================================');
  }
}
async function blogDelete(req, res){
  try {
    const {id} = req.params
    await sequelize.query(`DELETE FROM blog WHERE id= ${id}`)
    req.flash('success', 'Blog succesfully removed')
    res.redirect('/')
  } catch (error) {
    console.log('==========================================');
    console.log('error from PROCESS Blog Delete Process: ', error);
    console.log('==========================================');
  }
}
///////////////  CONTACT  ///////////////
function contact(req, res){
  res.render('contact', {
    title: 'Contact Page',
    isLogin: req.session.isLogin,
    user: req.session.user
  })
}
function sendContact(req, res){
  const {name, email, phone, subject, message} = req.body
  // console.log("data: ", name, email, phone, subject, message)
  res.redirect('/contact')
}

