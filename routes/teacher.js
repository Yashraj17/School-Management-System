const express = require('express');
const TeacherController = require('../controller/TeacherController');
const { teacherAuth } = require('../Middleware/auth');
const teacher = express.Router();

teacher.get('/',teacherAuth,TeacherController.dashboard)

///attendance
teacher.get('/attendance',teacherAuth,TeacherController.class_attendance)
//make attendance
teacher.post('/attendance',teacherAuth,TeacherController.present_student)

/////teacher payments///

teacher.get('/payments',teacherAuth,TeacherController.teacher_payments)

/////student***************
///view your student

teacher.get('/viewStudent',teacherAuth,TeacherController.view_your_student)

///manage teacher student 

teacher.get('/teacher-student/:class',teacherAuth,TeacherController.manage_student)

///////teacher view period///
teacher.get('/teacher-periods',teacherAuth,TeacherController.view_class_periods)



module.exports = teacher;