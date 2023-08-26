
const express = require('express')
const app = express()
const port = 5000
const path = require('path')
// const sendmail = require('sendmail')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// call ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// set serving static file
app.use(express.static('views'))
// Middleware
app.use(express.urlencoded({ extended: false }))



// function router
// Home
const home = (req, res) => {res.render('index', {title: 'Home', blogData })}
// Blog
const blog = (req, res) => {res.render('blog',  {title: 'Blog'})}
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
const blogDetail = (req, res) => { 
  const { id } = req.params 
  res.render('blog-detail', 
  {title: `Blog Detail ${id}`, blog: blogData[id]})
}
const blogEdit = (req, res) => { 
  const { id } = req.params 

  res.render('blog-edit', {title: 'Edit Blog', editBlog: blogData[id]}, console.log(blogData[id]))

  
  const { title,  description, content } = req.body 

  let editDataBlog = {
    title,  description, content
  }

  console.log('data dari Edit Blog: ', editDataBlog);

 
  res.redirect('/')
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
// app.get('/', )
// blog
app.get('/blog', blog)
app.get('/blog-detail/:id', blogDetail)
app.get('/blog-delete/:id', blogDelete)
app.get('/blog-edit/:id', blogEdit)
app.put('/blog-edit/:id', blogEdit)
app.post('/blog', addContentBlog)
// contact
app.get('/contact', contact)
app.post('/contact', sendContact)

// /////////////////////////////////


// function add blog
// function addContentBlog(req, res){
//   let  {title, technologies ,content} = req.body


//   // buat fungsi add ID auto add
  
//   let dataAddBlog = {
//   id:10, title, technologies ,content
//   }

//   blogData.push(dataAddBlog);

//   console.log("data addBlog: ", dataAddBlog)
//   res.redirect('/')
// }


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


