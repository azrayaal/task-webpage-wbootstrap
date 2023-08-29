
const express = require('express')
const app = express()
const port = 5000
const path = require('path')


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// call ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))

// set serving static file
app.use(express.static('src/assets'))
// Middleware
app.use(express.urlencoded({ extended: false }))

// function router
// Home
const home = (req, res) => {res.render('index', {title: 'Home', blogData }, console.log(blogData))}

// Blog
const blog = (req, res) => {res.render('blog',  {title: 'Blog'})}
const blogDetail = (req, res) => { 
  const { id } = req.params 
  res.render('blog-detail', 
  {title: `Blog Detail ${id}`, blog: blogData[id]})
  
}
const addContentBlog = (req, res)=>{
  let  {title, 
        technologies,
        content,  
        startDate,
        endDate} = req.body
  // buat fungsi add ID auto add
  // let nextId = blogData.length ++
  
  let nextId = 5

  let dataAddBlog = {
  id: nextId, 
  title, 
  technologies,
  content,  
  image: '/img/katheryne-card.png',
  startDate,
  endDate,
  postAt: new Date()
  }
  // nextId++
  blogData.push(dataAddBlog);

  console.log("data addBlog: ", dataAddBlog)
  res.redirect('/')
}
const viewBlogEdit=(req, res)=>{
  // ambil based on index!
  const { id } = req.params 

  // const editBlog = blogData[id].id;
  console.log(blogData.id)
  res.render('blog-edit', {title: 'Edit Blog', editBlog: blogData[id], id}, 
  console.log(blogData.id))
  
}
const blogEdit = (req, res) => { 
  // const {id} = req.params
  // const id = req.params.id

  // const editBlogId = parseInt(req.params.id)

  // const updateTitle = req.body.title
  // const updateContent = req.body.content
  // const updateTechnologies = req.body.technologies
  // const updateNewStartDate = req.body.startDate
  // const updateNewEndDate = req.body.endDate

  // const editData = blogData.find(editData => editData.id === editBlogId)  

  // if(editData){
  //     editData.title = updateTitle
  //     editData.content = updateContent
  //     editData.technologies = updateTechnologies
  //     editData.startDate = updateNewStartDate
  //     editData.endDate = updateNewEndDate
  //     editData.postAt = new Date()
      
  //     if(updateTitle === ''){
  //       res.send('TITLE MUST BE FILLED!')
  //      console.log('Title must be filled');
  //      res.redirect('/')  
  //     } else if (updateContent === ''){
  //       res.send('CONTENT HARUS DI ISI')
  //     } 

  //     res.redirect('/')
  // } else {
  //   res.send('Failed to update new data')
  // }

 const {id} = req.params
  console.log('tet');
  const {title, content, startDate, endDate, technologies } = req.body
  blogData[id].title = title
  blogData[id].content = content
  blogData[id].startDate = startDate
  blogData[id].endDate = endDate
  blogData[id].technologies = technologies
  blogData[id].postAt = new Date()

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

// const technologyIcons = {
//   'ExpressJS': 'fab fa-node-js',
//   'NodeJS': 'fab fa-node-js'
// };
// dummy data
const blogData = [
  { id: 0, 
    title: "Blog 0",
    content: 'Blog ipsum dolor amet data 0',
    technologies: ['NodeJs', 'ReactJs'],
    image: '/img/katheryne-card.png',
    startDate: '2023-08-28',
    endDate: '2023-08-31',
    postAt: '2023-08-28T02:03:13.424Z'
  },
  { id: 1, 
    title: "Blog 1",
    content: 'data 1 Blog ipsum dolor amet data 2',
    technologies: ['ReactJs', 'NodeJs', 'Go'],
    image: '/img/chef-mao-card.png',
    startDate: '2023-08-28',
    endDate: '2023-08-31',
    postAt: '2023-08-28T02:03:13.424Z'
  },
  { id: 2, 
    title: "Blog 2",
    content: 'data 2 Blog ipsum dolor amet data 3',
    technologies: ['Go', 'NodeJs'],
    image: '/img/chang-the-ninth-card.png',
    startDate: '2023-08-28',
    endDate: '2023-08-31',
    postAt: '2023-08-28T02:03:13.424Z'
  },
  { id: 3, 
    title: "Blog 3",
    content: 'data 3 Blog ipsum dolor amet data 4',
    technologies: ['ReactJs'],
    image: '/img/tian.png',
    startDate: '2023-08-28',
    endDate: '2023-08-31',
    postAt: '2023-08-28T02:03:13.424Z'
  },
  { id: 4, 
    title: "Blog 4",
    content: 'data 4 Blog ipsum dolor amet data 4',
    technologies: ['ReactJs', 'Go'],
    image: '/img/chang-the-ninth-card.png',
    startDate: '2023-08-28',
    endDate: '2023-08-31',
    postAt: '2023-08-28T02:03:13.424Z'
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


