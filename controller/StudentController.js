const studentAttendanceModel = require("../model/studentAttendance");
const studentPaymentPaymentModel = require("../model/studentPayment");
const moment = require("moment");


class StudentController{
    static dashboard = (req,res)=>{
        // var data = req.user
        // console.log('this is student detail',data._id);
        res.render('student/dashboard',{layout:'student/base'});
    }

    static due_payment = async (req,res)=>{
        var paymentdata=[]
        var student_id = req.user._id;
        var class_name = req.user.class_name;
        console.log('this is id of student',student_id._id);
        var student_data = await studentPaymentPaymentModel.findOne({student_id:student_id,class_name:class_name}).populate('student_id');
        // console.log(student_data);

        student_data.yearlypayments.forEach(data => {
            if (data.pay_status == 0) {
                paymentdata.push({
                    roll_no:req.user.rollno,
                    student_name:req.user.name,
                    contact:req.user.contact,
                    due_month:data.month_of_pay,
                    payment_purpose:'New Admission',
                    amount:data.admission_fee + data.book_and_accessories_fee,
                    email:req.user.email,
                    payment_status:data.pay_status
                })
            }
        });
        student_data.monthlypayments.forEach(data => {
            if (data.payment_status == 0) {
                paymentdata.push({
                    roll_no:req.user.rollno,
                    student_name:req.user.name,
                    contact:req.user.contact,
                    due_month:data.month_of_payment,
                    payment_purpose:'Tuition Fee',
                    amount:data.monthly_fee + data.transport_fee,
                    email:req.user.email,
                    payment_status:data.payment_status
                })
            }
        });
        console.log(paymentdata);
        res.render('student/studentPayments/payment',{payment:paymentdata,layout:'student/base'});
    }
    ///paid payments
    static paid_payment = async (req,res)=>{
        var paymentdata=[]
        var student_id = req.user._id;
        var class_name = req.user.class_name;
        console.log('this is id of student',student_id._id);
        var student_data = await studentPaymentPaymentModel.findOne({student_id:student_id,class_name:class_name}).populate('student_id');
        // console.log(student_data);

        student_data.yearlypayments.forEach(data => {
            if (data.pay_status == 1) {
                paymentdata.push({
                    roll_no:req.user.rollno,
                    student_name:req.user.name,
                    contact:req.user.contact,
                    due_month:data.month_of_pay,
                    payment_purpose:'New Admission',
                    amount:data.admission_fee + data.book_and_accessories_fee,
                    email:req.user.email,
                    payment_status:data.pay_status
                })
            }
        });
        student_data.monthlypayments.forEach(data => {
            if (data.payment_status == 1) {
                paymentdata.push({
                    roll_no:req.user.rollno,
                    student_name:req.user.name,
                    contact:req.user.contact,
                    due_month:data.month_of_payment,
                    payment_purpose:'Tuition Fee',
                    amount:data.monthly_fee + data.transport_fee,
                    email:req.user.email,
                    payment_status:data.payment_status
                })
            }
        });
        console.log(paymentdata);
        res.render('student/studentPayments/payment',{payment:paymentdata,layout:'student/base'});
    }
    //// all payments
    static all_payment = async (req,res)=>{
        var paymentdata=[]
        var student_id = req.user._id;
        var class_name = req.user.class_name;
        console.log('this is id of student',student_id._id);
        var student_data = await studentPaymentPaymentModel.findOne({student_id:student_id,class_name:class_name}).populate('student_id');
        // console.log(student_data);

        student_data.yearlypayments.forEach(data => {
            if (data.pay_status == 1 || data.pay_status == 0) {
                paymentdata.push({
                    roll_no:req.user.rollno,
                    student_name:req.user.name,
                    contact:req.user.contact,
                    due_month:data.month_of_pay,
                    payment_purpose:'New Admission',
                    amount:data.admission_fee + data.book_and_accessories_fee,
                    email:req.user.email,
                    payment_status:data.pay_status
                })
            }
        });
        student_data.monthlypayments.forEach(data => {
            if (data.payment_status == 1 || data.payment_status == 0) {
                paymentdata.push({
                    roll_no:req.user.rollno,
                    student_name:req.user.name,
                    contact:req.user.contact,
                    due_month:data.month_of_payment,
                    payment_purpose:'Tuition Fee',
                    amount:data.monthly_fee + data.transport_fee,
                    email:req.user.email,
                    payment_status:data.payment_status
                })
            }
        });
        // console.log(paymentdata);
        res.render('student/studentPayments/payment',{payment:paymentdata,layout:'student/base'});
    }

    ///////student attendance report 

    static attendance_report = async (req,res)=>{
        var attendance_report=[];
        var student_id = req.user._id;
        var class_name = req.user.class_name
        var month = moment().format('MMMM')
        var no_of_attendance = await studentAttendanceModel.find({month:month,class_name:class_name}).countDocuments()
        var attendance_data = await studentAttendanceModel.find({month:month,class_name:class_name}).populate('attendance.student_id')
        console.log(no_of_attendance);
        for (let i = 0; i < no_of_attendance; i++) {
          
            attendance_data[i].attendance.forEach(element => {
                var attend_id = element.student_id.rollno
                  console.log('this is attendance detail',element.student_id._id);
                  console.log('this is id of studtn',student_id);
                if (attend_id == req.user.rollno) {
                   console.log('hello world');
                    attendance_report.push({
                        date:attendance_data[i].date,
                        month:attendance_data[i].month,
                        status:element.status
                    })
                }
                console.log('this is attendance report',attendance_report);
            });
            
        }
        res.render('student/studentAttendance/studentAttendance',{attendance:attendance_report,layout:'student/base'});
    }
    
}
module.exports = StudentController;