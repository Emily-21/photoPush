const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
//  as well as the usual requirements for handlebars we also need Multer, this is our chosen middleware
// for file uploading.
app.use(express.static(path.join(__dirname, 'public')));
//typical set up for hbs (need to figure out what this part does)
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '/uploads'))
    },
    //multer set up, telling where to store the photos
filename: function(req, file, cb) {
    console.log('file', file)
    fileExtension = file.originalname.split('.')[1]
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension)
},
})
// multer set up, saying what to name the photos
 const upload = multer({ storage: storage})

 app.engine('.hbs', hbs({
    defaultLayout:'layout', 
    extname: 'hbs'
}))

app.set('view engine', '.hbs')

app.get('/', (req, res) => {
res.render('index')
})

app.get('/images', (req, res) => {
    let names = fs.readdirSync(__dirname + '/uploads');
    res.render('images', {names});
    })

app.post('/upload', upload.single('image'), (req, res) => { 
    //the single file name ('image') and path ('/upload') must match the ones on the form
    let uploadedfile = req.file.fieldname

    if (uploadedfile) {
        res.render('images')
    }
})
// we're saying ? something, then if a file is uploaded,render the images page. We could add a message here saying file upload success

app.get('/images',(req, res) => {
    res.render('images');
})



app.listen(3000, () => {
    console.log('listening on port 3000');
})