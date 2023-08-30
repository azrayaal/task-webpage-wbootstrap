
const express = require('express')
// const { Sequelize } = require('sequelize');
const app = express()
const port = 5000
const path = require('path')


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// sequelize setup
const config = require('./src/config/config.json')
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(config.development)


// call ejs as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))

// set serving static file
app.use(express.static('src/assets'))
// Middleware
app.use(express.urlencoded({ extended: false }))

// function router
// Home

const home = async (req, res) => {
  try {
    // const query = `SELECT * FROM blog;`
    // let obj = await sequelize.query(query, { type: QueryTypes.SELECT})
    
    // console.log('objdb: ', obj);
    // res.render('index', {title: 'Home', blogData: obj})


    const data =  await sequelize.query(`SELECT * FROM blog`)

    console.log('objdb: ', data);
    res.render('index', {title: 'Home', blogData: data})
  } catch (error) {
    console.log('error bos', error);
  }

  // res.render('index', {title: 'Home', blogData }, 
  // console.log('BLOG DARI DAT: ', blogData)
  // )
}

// Blog
const blog = (req, res) => {res.render('blog',  {title: 'Blog'})}
const blogDetail = (req, res) => { 
  const { id } = req.params 
  res.render('blog-detail', 
  {title: `Blog Detail ${id}`, blog: blogData[id]})
  
}
const addContentBlog = async(req, res)=>{
try {
  let  {title, start_date, end_date, content, technologies} = req.body
  const image = '/img/katheryne-card.png'

await sequelize.query(`INSERT INTO blog(title, start_date, end_date, content, technologies, image) VALUES ('${title}', '${start_date}', '${end_date}', '${content}', ARRAY ['${technologies}'], '${image}')`)

  console.log("data addBlog: ", title, start_date, end_date, content, technologies)
  res.redirect('/')
} catch (error) {
  console.log("ERROR BOS: ", error);
}
  // let  {title, 
  //       technologies,
  //       content,  
  //       startDate,
  //       endDate} = req.body
  // // buat fungsi add ID auto add
  // // let nextId = blogData.length ++
  
  // let nextId = 1

  // let dataAddBlog = {
  // id: nextId, 
  // title, 
  // technologies,
  // content,  
  // image: '/img/katheryne-card.png',
  // startDate,
  // endDate,
  // postAt: new Date()
  // }

  // // nextId++
  // blogData.push(dataAddBlog);

  // console.log("data addBlog: ", dataAddBlog)
  // res.redirect('/')
}
const viewBlogEdit= async(req, res)=>{
try {
  const {id} = req.params

  await sequelize.query(`SELECT * FROM blog WHERE id=${id}`)
} catch (error) {
  console.log('error bos: ', error);
}

  // // ambil based on index!
  // const { id } = req.params 
  // // const editBlog = blogData[id].id;
  // console.log(blogData.id)

  // res.render('blog-edit', {title: 'Edit Blog', editBlog: blogData[id], id}, 
  // console.log(blogData.id))
  
}
const blogEdit = async(req, res) => { 
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

//  const {id} = req.params
//   console.log('tet');
//   const {title, content, startDate, endDate, technologies } = req.body
//   blogData[id].title = title
//   blogData[id].content = content
//   blogData[id].startDate = startDate
//   blogData[id].endDate = endDate
//   blogData[id].technologies = technologies
//   blogData[id].postAt = new Date()

//   res.redirect('/')

try {
  const {id} = req.params

  let{
    title, start_date, end_date, content, technologies
  } = req.body

  await sequelize.query(`UPDATE blog SET (title='${title}', start_date='${start_date}, end_date='${end_date}', content='${content}') WHERE id=${id}`)
  console.log('data update: ', title, start_date, end_date, content, technologies);
  } catch (error) {
}
}

const blogDelete = async(req, res) => { 
try {
  const { id } = req.params 
  // console.log('id', id);
  await sequelize.query(`DELETE FROM blog WHERE id = ${id}`)
  
  // blogData.splice(id, 1)
      res.redirect('/')
    } catch (error) {
      console.log('error: ', error);
    }
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
  // { id: 1, 
  //   title: "Blog 1",
  //   content: 'data 1 Blog ipsum dolor amet data 2',
  //   technologies: ['ReactJs', 'NodeJs', 'Go'],
  //   image: '/img/chef-mao-card.png',
  //   startDate: '2023-08-28',
  //   endDate: '2023-08-31',
  //   postAt: '2023-08-28T02:03:13.424Z'
  // },
  // { id: 2, 
  //   title: "Blog 2",
  //   content: 'data 2 Blog ipsum dolor amet data 3',
  //   technologies: ['Go', 'NodeJs'],
  //   image: '/img/chang-the-ninth-card.png',
  //   startDate: '2023-08-28',
  //   endDate: '2023-08-31',
  //   postAt: '2023-08-28T02:03:13.424Z'
  // },
  // { id: 3, 
  //   title: "Blog 3",
  //   content: 'data 3 Blog ipsum dolor amet data 4',
  //   technologies: ['ReactJs'],
  //   image: '/img/tian.png',
  //   startDate: '2023-08-28',
  //   endDate: '2023-08-31',
  //   postAt: '2023-08-28T02:03:13.424Z'
  // },
  // { id: 4, 
  //   title: "Blog 4",
  //   content: 'data 4 Blog ipsum dolor amet data 4',
  //   technologies: ['ReactJs', 'Go'],
  //   image: '/img/chang-the-ninth-card.png',
  //   startDate: '2023-08-28',
  //   endDate: '2023-08-31',
  //   postAt: '2023-08-28T02:03:13.424Z'
  // },
];
// TECH
// array satu ga masuk, tapi dua masuk












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


