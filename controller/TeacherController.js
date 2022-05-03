const studentAttendanceModel = require('../model/studentAttendance')
const class_and_teacherModel = require('../model/classModel')
const teacherPaymentModel = require('../model/teacherPayment')
const teacherModel = require('../model/teacherModel')
const moment = require("moment");
const teacher = require('../routes/teacher');
class TeacherController{
    static dashboard = (req,res)=>{
        res.render('teacher/dashboard',{layout:'teacher/base'});
    }

    static class_attendance = async (req,res)=>{
        
        var class_teacher_id= req.user._id;
        var date =moment().format('LL')
        // var date = "April 23, 2022";
         var classTeacher_data =  await  class_and_teacherModel.findOne({class_teacher_id:class_teacher_id});
        
         if (classTeacher_data!==null) {
            var class_name = classTeacher_data.class_name
            var class_attendance = await studentAttendanceModel.findOne({date:date,class_name:class_name,class_teacher_id:class_teacher_id}).populate('attendance.student_id')
            console.log(class_attendance);
            res.render('teacher/Attendance/classAttendance',{
                class_data:class_attendance,
                layout:'admin/base'});
         }
         else{
             console.log('no data available');
             res.render('teacher/Attendance/classAttendance',{
                class_data:class_attendance,
                layout:'admin/base'});
         }
    
    }
    //// make attendance controller function
    static present_student = async (req,res)=>{
        var class_name = req.body.class;
        var student_id = req.body.student_id

        var date =moment().format('LL')
        // var date = "April 23, 2022";
    
     await studentAttendanceModel.updateOne({"date" : date ,"class_name":class_name, "attendance.student_id":student_id}, { $set: { "attendance.$.status" : "P" } })
        // console.log(val);
         res.redirect('back')
       }

       /////view payments

       static teacher_payments = async (req,res) =>{
        //    console.log(req.user._id);
          var teacher_id = req.user._id
        //   console.log(teacher_id);
           var teacher_payment_data = await  teacherPaymentModel.find({teacher_id:teacher_id}).populate('teacher_id')
           res.render('teacher/Payment/ViewPayments',{data:teacher_payment_data,layout:'teacher/base'})
       }

    //    *********************student*********************************

       //////////////////view your student ////

       static view_your_student = async (req,res)=>{
        var teacher_id = req.user._id
           var view_class = await class_and_teacherModel.find({$or: [{"class_teacher_id":teacher_id},{"subject_teacher.subject_teacher_id":teacher_id}]}).populate('class_teacher_id')
        //    console.log(view_class);
           res.render('teacher/Student/teacher_classes',{data:view_class,layout:'teacher/base'})
       }

       /////////////manage student classes////
       static manage_student = async (req,res)=>{
        var class_name = req.params.class;
        var classStudent_data =  await class_and_teacherModel.findOne({class_name:class_name}).populate('class_teacher_id').populate('students.student_id');
        res.render('teacher/Student/manage_teacher_std',{
            // data:data,
            class_data:classStudent_data,
            layout:'teacher/base'});
       }


       static view_class_periods = async (req,res)=>{
            var teacher_id = req.user._id
        var teacherData = await teacherModel.findById(teacher_id);
        var teacher_period = teacherData.class_periods;
        var p = teacher_period.sort((a, b)=>{return a.period_name-b.period_name});
        res.render('teacher/Student/viewPeriods',{
            period:p,
            layout:'teacher/base'});
       }

}
module.exports = TeacherController;