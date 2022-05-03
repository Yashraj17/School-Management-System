const express = require('express');
const { paynow, callback } = require('../controller/PaytmController');
const StudentController = require('../controller/StudentController');
const { studentAuth } = require('../Middleware/auth');
const student = express.Router();

student.get('/',studentAuth,StudentController.dashboard)

///view due payments
student.get('/payment-due',studentAuth,StudentController.due_payment)
///view paid payments
student.get('/payment-paid',studentAuth,StudentController.paid_payment)
///view all payments
student.get('/payment-all',studentAuth,StudentController.all_payment)

////student attendance report 
student.get('/attendance-report',studentAuth,StudentController.attendance_report)

/////////////////paytm itegration in node js

const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

student.post('/paynow',[studentAuth,parseUrl, parseJson],paynow)
student.post('/callback',callback)
// student.post('/student',studentAuth,(req,res)=>{
//     res.send(req.user)
// })


module.exports = student;