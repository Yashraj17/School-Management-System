const express = require('express');
const HomeController = require('../controller/HomeController');
const home = express.Router();
///home page
home.get('/',HomeController.HomePage);
/// apply page
home.get('/apply',HomeController.applyPage)
///apply student post route
home.post('/apply',HomeController.applystudent)

///student login page
home.get('/student/login',HomeController.loginPage);
///student login
home.post('/student/login',HomeController.studentLogin);

///student login
home.get('/student/logout',HomeController.studentLogout);

///teacher login page
home.get('/teacher/login',HomeController.TeacherloginPage);
///teacher login
home.post('/teacher/login',HomeController.teacherLogin);

///teacher login
home.get('/teacher/logout',HomeController.teacherLogout);


module.exports = home;