const express = require('express');
const AdminController = require('../controller/AdminController');
const admin = express.Router();

admin.get('/dashboard',AdminController.dashboard)

//////////////admission**************
///new Admission page
admin.get('/newAdmission',AdminController.newAdmission)

///approve admission page
admin.get('/approve-admission/:std_id',AdminController.approval_form)

///approve admission 
admin.post('/approve-admission',AdminController.approve_admission)


///////////////////////admin student******************
///view manage student dashboard///
admin.get('/manageStudent',AdminController.student_classdashboard)

//manage student according to class
admin.get('/manageStudent/:class',AdminController.manage_student_class)


// ***************XXXXXXXXXXXX**************

/////////////student Payment ////////////
///payment dashboard//

admin.get('/classPayments',AdminController.student_paymentdashboard)


//// class student payments
admin.get('/studentPayment/:class',AdminController.student_payment)


// ***********XXXXXXXXXXXXXXXXXXX************

//////////////////////staff/////////////
//////managestaff////
admin.get('/manageStaff',AdminController.manageStaff)

////////////////create staff
admin.post('/manageStaff',AdminController.createStaff)

////////////////////staff payment///////////
admin.get('/managePayment',AdminController.staffPayment)
//////make payment staff///////////
admin.get('/make-payment/:id',AdminController.makePayment_staff)

///////////////////////teacher//////////////

//////managestaff////
admin.get('/manageTeacher',AdminController.manageTeacher)

//////createTeacher/////
admin.post('/manageTeacher',AdminController.createTeacher)
////////////////////teacher payment///////////
admin.get('/manage-teacher-payment',AdminController.teacherPayment)

//////make payment teacher///////////
admin.get('/manage-teacher-payment/:id',AdminController.makePayment_teacher)

////////////////class and teacher///////////////
//////manage classteacher 
admin.get('/manageClass',AdminController.manage_class_and_teacher)

//////insert class and class teacher
admin.post('/manageClass',AdminController.insert_class_teacher)


////////add class period////
///view all classes
admin.get('/viewAllClass',AdminController.viewclassdashboard)

//manage class period
admin.get('/manageClassPeriod/:class',AdminController.manage_class_period)

///////////////ajax subject ////
admin.post('/subject/name',AdminController.teacher_name);

/////////insert subject and period/////
admin.post('/insertSubjectPeriod',AdminController.insert_subject_period)



///////////////////////////payment***********************

////route for fee structure////

////class fee structure
admin.get('/classFeeStructure',AdminController.class_fee_structure)
///insert class fee structure
admin.post('/classFeeStructure',AdminController.insert_class_fee)



//////////////////////////ATTENDANCE/////////////////

///view attendance dashboard///
admin.get('/attendance',AdminController.attendance_dashboard)

////// class wise student attendance 
admin.get('/attendance/:class',AdminController.class_attendance)

/// make attendance 
admin.post('/attendance/:class',AdminController.present_student);

module.exports = admin;