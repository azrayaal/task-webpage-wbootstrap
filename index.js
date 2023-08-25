
const express = require('express')
const app = express()
const port = 5000
const path = require('path')
const sendmail = require('sendmail')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// set serving static file
app.use(express.static('views'))
// Middleware
app.use(express.urlencoded({ extended: false }))



// function router
const home = (req, res) => {res.render('index', {title: 'Home'})}
const blog = (req, res) => {res.render('blog',  {title: 'Blog'})}
const contact = (req, res) => {res.render('contact', {title: 'Contact'})}

// router
app.get('/', home)
app.get('/blog', blog)
app.get('/contact', contact)
app.post('/blog', addContentBlog)
app.post('/contact', sendContact)

// function blog
function addContentBlog(req, res){
  let  {projectName, startDate, endDate, description} = req.body
  console.log("data: ", projectName, startDate, endDate, description)
  
  res.redirect('/blog')
}


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
