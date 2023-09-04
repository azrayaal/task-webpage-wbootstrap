
const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const upload = require('./src/middlewares/uploadFileImage')
// const multer  = require('multer')
// const upload = multer({ dest: './src/uploads' })


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
app.post('/blog', upload.single('image'), addContentBlog)
app.get('/blog-detail/:id', viewBlogDetail)
app.get('/blog-edit/:id', viewBlogEdit)
app.post('/blog-edit/:id', upload.single('image'), blogEdit)
app.get('/blog-delete/:id', blogDelete)
// contact
app.get('/contact', contact)
app.post('/contact', sendContact)

//////////////////  FUNCTION  ////////////////////////////////
///////////////  HOME  /////////////// 
async function home(req, res){ 
  try {
    if(!req.session.isLogin){
      const query = `SELECT * FROM projects `
      let dataProjects = await sequelize.query(query, {type: QueryTypes.SELECT})

      res.render('index', {
        title: 'Home Page', 
        blogData: dataProjects,
        isLogin: req.session.isLogin,
        user: req.session.user,
        idUser: req.session.idUser,
      })
      // console.log('==========================================');
      // console.log('dataProjects at homepage: ', dataProjects);
      // console.log('==========================================');
    } else {
    const query = `SELECT * FROM projects`
    let dataProjects = await sequelize.query(query, {type: QueryTypes.SELECT})
    /////////// debuging ///////////
    // const isLogin = req.session.isLogin
    // const user = req.session.user
    // const idUser =  req.session.idUser
    const idUser = req.session.idUser;
    const matchProject = dataProjects.filter(blog => blog.author === idUser);
    // matchProject author === idUser
      res.render('index', {
        title: 'Home Page', 
        blogData: matchProject,
        isLogin: req.session.isLogin,
        user: req.session.user,
        idUser: req.session.idUser,
      })
    }
    // console.log('==========================================');
    // console.log('author and idUser at homepage: ', author, idUser);
    // console.log('filteredBlogs at homepage: ', matchProject);
    // console.log('==========================================');
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
      const query = `INSERT INTO users (name, email, password, "createdAt", "updatedAt") VALUES ('${name}', '${email}', '${hassPassword}', NOW(), NOW())`
      sequelize.query(query)
      req.flash('success', 'Successfully Register')
      return res.redirect('/login')
    })
    // res.redirect('/login')
 
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
    const query = `SELECT * FROM Users WHERE email = '${email}'`

    const dataUsers = await sequelize.query(query, {type: QueryTypes.SELECT})
    // cek email
    if(!dataUsers.length){
      req.flash('danger', 'Email has not been registered!')
      return res.redirect('/login')
    }
// cek password
    await bcrypt.compare(password, dataUsers[0].password, (err, isMatch)=>{
      if(!isMatch){
        req.flash('danger', 'Sorry, your password is wrong')
        return res.redirect('/login')
      } else {
        const isLogin = req.session.isLogin = true
        isLogin
        // req.session.isLogin = true
        const username = req.session.user = dataUsers[0].name
        username
        const idUser = req.session.idUser = dataUsers[0].id
        idUser
        // req.session.user = dataUsers[0].name
        req.flash('success', 'Login successful')
       
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
///////////////  LOGOUT  ///////////////
function logOut(req, res){
  req.session.destroy()
  res.redirect('/login')
}




///////////////  BLOG  ///////////////
function viewFormBlog(req, res){
  if(!req.session.isLogin){
    res.redirect('/login')
  } else {
    res.render('blog', {
      title: 'Blog Page',
      isLogin: req.session.isLogin,
      user: req.session.user
    })
  }
}
async function addContentBlog(req, res){
  try {
  const {title, content, technologies, start_date, end_date} = req.body
  const image = req.file.filename
  const author_text = req.session.user
  const idUser = req.session.idUser

  const date1 = new Date(start_date);
  const date2 = new Date(end_date);
  const time = date2 - date1;
  const days = Math.ceil(time / (1000 * 60 * 60 * 24));
  let durations = days;

  // await sequelize.query(`INSERT INTO projects (author, title, content, technologies, start_date, end_date, image, "createdAt", "updatedAt") VALUES ('${author}', '${title}', '${content}', '{${technologies}}', '${start_date}', '${end_date}', '${image}', NOW(), NOW())`)

  // await sequelize.query(`INSERT INTO projects (author, title, content, technologies, start_date, end_date, image, duration, "createdAt", "updatedAt") 
  // VALUES ('${idUser}', '${title}', '${content}', '{${technologies}}', '${start_date}', '${end_date}', '${image}', '${duration}', NOW(), NOW())`)


  await sequelize.query(`INSERT INTO projects (author, title, content, technologies, start_date, end_date, image, durations, author_text, "createdAt", "updatedAt") 
  VALUES (${idUser}, '${title}', '${content}', '{${technologies}}', '${start_date}', '${end_date}', '${image}', '${durations}', '${author_text}', NOW(), NOW())`)
  req.flash('success', 'New Project has been added')
  return res.redirect('/')
  
  } catch (error) {
    console.log('==========================================');
    console.log('error from PROCESS ADD CONTENT: ', error);
    console.log('==========================================');
  }
}
async function viewBlogDetail(req, res){
  try {
    //////////////////////// DATE POST //////////////
    /////////////////////////////////////////////////

   const {id} = req.params
  //  const query = `SELECT * FROM projects WHERE id= ${id}`
  const query = `SELECT projects.title, projects.content, projects.image, projects.technologies, projects.durations, projects.start_date, projects.end_date, users.name FROM projects LEFT JOIN users ON projects.author = users.id WHERE projects.id = ${id}`

// const query = `SELECT projects.title, projects.content, projects.technologies, users.name FROM projects LEFT JOIN users ON projects.author = users.id WHERE projects.id = ${id}`

   const blog = await sequelize.query(query, {type: QueryTypes.SELECT})

   const data = blog.map((item) =>({
    ...item,
   }))

   console.log('==========================================');
   console.log('data detail page: ', data);
   console.log(`SELECT * FROM blogs WHERE id = ${id}`);
   console.log('==========================================');
   
   res.render('blog-detail', {
    title: 'Blog Detail Page', 
    blog: data[0],
    isLogin: req.session.isLogin,
    user: req.session.user,
    idUser: req.session.idUser
   })
  } catch (error) {
    console.log('==========================================');
    console.log('error from PROCESS Blog Detail Page: ', error);
    console.log('==========================================');
  }
}
async function viewBlogEdit(req, res){
  if(!req.session.isLogin){
    res.redirect('/login')
  }else{
    try {
      const {id} = req.params
      const query = `SELECT * FROM projects WHERE id = ${id}`
      
      const blog = await sequelize.query(query, {type: QueryTypes.SELECT})
      
  
      const data = blog.map((item)=>({
        ...item
      }))
  
      res.render('blog-edit', {
        title: 'Blog Edit', 
        editBlog: data[0],
        isLogin: req.session.isLogin,
        user: req.session.user,
       
    })
      
    } catch (error) {
      console.log('==========================================');
      console.log('error from PROCESS Blog Edit Page: ', error);
      console.log('==========================================');
    }
  }
}
async function blogEdit(req, res){
  try {
    const {id} = req.params
    const {title, start_date, end_date, technologies} = req.body
    const image = req.file.filename

    await sequelize.query(`UPDATE projects SET title = '${title}', start_date = '${start_date}', end_date = '${end_date}', technologies = '{${technologies}}', image = '${image}'  WHERE id = '${id}'`)

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
    await sequelize.query(`DELETE FROM projects WHERE id= ${id}`)
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

