const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const path = require('path')
const ejsLayout = require('express-ejs-layouts')
const ConnectDB = require('./database/connectdb');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const home = require('./routes/home')
const student = require('./routes/student')
const teacher = require('./routes/teacher')
const admin = require('./routes/admin')
const app = express();

const DATABASE_URL = process.env.URL;
ConnectDB(DATABASE_URL);
app.use(ejsLayout)

//cookie parser
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended:false}));

// const staticPath = path.join(__dirname,'./public');
// app.use(express.static(staticPath))


app.set('view engine','ejs');
app.set('views','./views')
app.set('layout', 'home/layout.ejs');
app.set('layout', 'admin/base.ejs');
app.set('layout', 'student/base.ejs');
app.set('layout', 'teacher/base.ejs');


app.use('/',home);
app.use('/admin',admin);
app.use('/teacher',teacher);
app.use('/student',student);


app.listen(8081);