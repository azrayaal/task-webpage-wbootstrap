
const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash');

// const sendmail = require('sendmail')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// call ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// set serving static file
app.use(express.static('views'))
app.use(flash());
// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'a',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))




// function router
// Home
const home = (req, res) => {res.render('index', {title: 'Home', blogData })}

// Blog
const blog = (req, res) => {res.render('blog',  {title: 'Blog'})}
const blogDetail = (req, res) => { 
  const { id } = req.params 
  res.render('blog-detail', 
  {title: `Blog Detail ${id}`, blog: blogData[id]})
}
const addContentBlog = (req, res)=>{
  let  {title, technologies ,content} = req.body
  // buat fungsi add ID auto add
  let dataAddBlog = {
  id:10, title, technologies ,content
  }

  blogData.push(dataAddBlog);
  console.log("data addBlog: ", dataAddBlog)
  res.redirect('/')
}
const viewBlogEdit=(req, res)=>{
  const { id } = req.params 
  res.render('blog-edit', {title: 'Edit Blog', editBlog: blogData[id]}, console.log(blogData[id]))
}
const blogEdit = (req, res) => { 
  const editBlogId = parseInt(req.params.id)
  const updateTitle = req.body.title
  const updateContent = req.body.content
  const updateTechnologies = req.body.technologies
  // const updateImage = req.body.image

  const editData = blogData.find(editData => editData.id === editBlogId)

  if(editData){
      editData.title = updateTitle
      editData.content = updateContent
      editData.technologies = updateTechnologies
      // editData.image = updateImage

      if(updateTitle === ''){
        const failedMessage = req.flash('FAILED', 'Title must be filled!');
        res.send({ failedMessage })
        // req.flash('FAILED', 'Title must be filled!');
        // res.redirect('/')
      //  console.log('Title must be filled');
      } else if (updateContent === ''){
        res.send('CONTENT HARUS DI ISI')
      } else if (updateTechnologies === ''){
        res.send('TECHNOLOGIES HARUS DI PILIH')
      }

      res.redirect('/')
  } else {
    res.send('Failed to update new data')
  }
}
const blogDelete = (req, res) => { 
  const { id } = req.params 
  blogData.splice(id, 1)
  res.redirect('/')
}

// Contact
const contact = (req, res) => {res.render('contact', {title: 'Contact'})}

//////////// router
// home
app.get('/', home)
// blog
app.get('/blog', blog)
app.post('/blog', addContentBlog)
app.get('/blog-detail/:id', blogDetail)
app.get('/blog-edit/:id', viewBlogEdit)
app.post('/blog-edit/:id', blogEdit)
app.get('/blog-delete/:id', blogDelete)
// contact
app.get('/contact', contact)
app.post('/contact', sendContact)


// /////////////////////////////////

// dummy data
const blogData = [
  { id: 0, 
    title: "Blog 1",
    content: 'Blog ipsum dolor amet data 1',
    technologies: ['NodeJS', 'ExpressJS'],
    image: '/img/katheryne-card.png'
  },
  { id: 1, 
    title: "Blog 2",
    content: 'data 2 Blog ipsum dolor amet data 2',
    technologies: ['ExpressJS', 'NodeJS'],
    image: '/img/chef-mao-card.png'
  },
  { id: 2, 
    title: "Blog 3",
    content: 'data 3 Blog ipsum dolor amet data 3',
    technologies: ['NodeJS', 'ExpressJS'],
    image: '/img/chang-the-ninth-card.png'
  },
  { id: 3, 
    title: "Blog 4",
    content: 'data 4 Blog ipsum dolor amet data 4',
    technologies: ['ExpressJS', 'NodeJS'],
    image: '/img/tian.png'
  },
];














// function contact
function sendContact(req, res){
  let  {name, email, phone, subject, message} = req.body

  console.log("data: ", name, email, phone, subject, message)

  

// Email content
// const mailOptions = {
//     from: email,
//     to: 'azrayazidalkautsar@gmail.com',
//     subject: subject,
//     text: message,
// };

// // Send the email
// const sendmail = require('sendmail')();
//     sendmail(mailOptions, (error, reply) => {
//         if (error) {
//             console.log(error);
//             res.send('Error sending email.');
//         } else {
//             console.log('Email sent:', reply);
//             res.send('Email sent successfully.');
//         }
//     });




  res.redirect('/contact')
  // console.log('info info');
}


