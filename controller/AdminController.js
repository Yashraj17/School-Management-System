const studentModel = require('../model/studentModel')
const bcrypt = require('bcrypt')
const moment = require("moment");
const staffModel = require('../model/staffModel');
const staffPaymentModel = require('../model/staffPayment');
const teacherModel = require('../model/teacherModel');
const class_and_teacherModel = require('../model/classModel');
const class_fee_structureModel = require('../model/class_fee_structure');
const studentPaymentPaymentModel = require('../model/studentPayment');
const studentAttendanceModel = require('../model/studentAttendance');
const teacherPaymentModel = require('../model/teacherPayment');
class AdminController{
    static dashboard = (req,res)=>{
        res.render('admin/dashboard',{layout:'admin/base'});
    }

    ////////////////////////admission**********
    //new admission
    static newAdmission = async (req,res)=>{
        var data = await studentModel.find({admission_status:0});
        res.render('admin/newAdmission',{data:data,layout:'admin/base'});
    }
    ///admission approval form
    static approval_form = async (req,res)=>{
        var std_id = req.params.std_id;
        var data = await studentModel.findOne({_id:std_id,status:0});
        res.render('admin/approveAdmission',{data:data,layout:'admin/base'});
    }

    ///approve admission
    static approve_admission = async(req,res)=>{
        var currentDate = new Date();
        var currYear = currentDate.getFullYear();
        var currMonth = currentDate.getMonth() + 1;
        var currDate = currentDate.getDate();
        var date_of_admission = currDate +'-'+ currMonth +'-'+ currYear
        var {std_id , std_name,class_name,rollno,book_and_accessories,admission_type} = req.body
        var student_data = await studentModel.findOneAndUpdate({_id:std_id}, { "$set": { "class_name": class_name, "rollno": rollno, "book_and_accessories": book_and_accessories, "admission_type": admission_type,'date_of_admission':date_of_admission,'admission_status':1}},{new: true});
        if (student_data != null) {
            class_and_teacherModel.findOne({class_name:class_name}, (error,data)=>{
                if (data != null) {
                    data.students.push({
                        student_id:std_id,
                    })
                     data.save();
                    
                    this.generatePayment(req,res,student_data)
                     res.redirect('/admin/newAdmission')
                }
            });
        } else {
            
            console.log('something went worng');
        }
    }

    static generatePayment = async(req,res,student_data)=>{
        var currentDate = new Date();
        var currYear = currentDate.getFullYear();
        var currMonth = currentDate.getMonth() + 1;
        var currDate = currentDate.getDate();
        var date_of_admission = currDate +'-'+ currMonth +'-'+ currYear
        var month =moment().format('MMMM YYYY'); 

        var {std_id , std_name,class_name,rollno,book_and_accessories,admission_type} = req.body
        //  console.log('this is student name',student_data);
        var fee_structure = await class_fee_structureModel.findOne({class_name:class_name})
        var new_admission_fee = fee_structure.new_admission_fee
        var monthly_fee = fee_structure.monthly_fee
        var book_and_access_fee = fee_structure.book_and_access_fee

        var book_and_accessories_status = student_data.book_and_accessories
        var transport_status = student_data.transport
        if (book_and_accessories_status == 'no' && transport_status == 'no') {
            var std_payment =await studentPaymentPaymentModel.findOne({student_id:std_id})
            if (std_payment ==null) {
                var data = new studentPaymentPaymentModel({
                    student_id:student_data._id,
                    class_name:student_data.class_name,
                    yearlypayments:[
                        {
                            admission_fee:new_admission_fee,
                            session_year:currYear,
                            month_of_pay:month,
                            date_of_pay:date_of_admission
                        }
                        
                    ],
                    monthlypayments:[
                        {
                            monthly_fee:monthly_fee,
                            month_of_payment:month,
                            date_of_payment:date_of_admission
                        }
                        
                    ]
                })
                await data.save();
            }
        }
        else if(book_and_accessories_status == 'yes' && transport_status == 'yes'){
            var std_payment =await studentPaymentPaymentModel.findOne({student_id:std_id})
            if (std_payment ==null) {
                var data = new studentPaymentPaymentModel({
                    student_id:student_data._id,
                    class_name:student_data.class_name,
                    yearlypayments:[
                        {
                            admission_fee:new_admission_fee,
                            book_and_accessories_fee:book_and_access_fee,
                            session_year:currYear,
                            month_of_pay:month,
                            date_of_pay:date_of_admission
                        }
                        
                    ],
                    monthlypayments:[
                        {
                            monthly_fee:monthly_fee,
                            transport_fee:500,
                            month_of_payment:month,
                            date_of_payment:date_of_admission
                        }
                        
                    ]
                })
                await data.save();
            }
            console.log('yes ');
        }
        else if(book_and_accessories_status == 'yes' && transport_status == 'no'){
            var std_payment =await studentPaymentPaymentModel.findOne({student_id:std_id})
            if (std_payment ==null) {
                var data = new studentPaymentPaymentModel({
                    student_id:student_data._id,
                    class_name:student_data.class_name,
                    yearlypayments:[
                        {
                            admission_fee:new_admission_fee,
                            book_and_accessories_fee:book_and_access_fee,
                            session_year:currYear,
                            month_of_pay:month,
                            date_of_pay:date_of_admission
                        }
                        
                    ],
                    monthlypayments:[
                        {
                            monthly_fee:monthly_fee,
                            month_of_payment:month,
                            date_of_payment:date_of_admission
                        }
                        
                    ]
                })
                await data.save();
            }
        }
        else{
            var std_payment =await studentPaymentPaymentModel.findOne({student_id:std_id})
            if (std_payment ==null) {
                var data = new studentPaymentPaymentModel({
                    student_id:student_data._id,
                    class_name:student_data.class_name,
                    yearlypayments:[
                        {
                            admission_fee:new_admission_fee,
                            session_year:currYear,
                            month_of_pay:month,
                            date_of_pay:date_of_admission
                        }
                        
                    ],
                    monthlypayments:[
                        {
                            monthly_fee:monthly_fee,
                            transport_fee:500,
                            month_of_payment:month,
                            date_of_payment:date_of_admission
                        }
                        
                    ]
                })
                await data.save();
            }
        };
    }



    /////////////////////////admin student********************

    //////student dashboard view////
static student_classdashboard = async (req,res)=>{
    var data = []
    // var data = await teacherModel.find({status:0});
    var no_of_class= await class_and_teacherModel.find({}).countDocuments()
    var class_data =  await class_and_teacherModel.find({}).populate('class_teacher_id');
    for (let i = 0; i < no_of_class; i++) {
        console.log(class_data[i].students.length);
        for (let j = 0; j < class_data[i].students.length; j++) {
            console.log(class_data[i].students[j].student_id);
            
        }
        data.push({
            class_name:class_data[i].class_name,
            class_teacher:class_data[i].class_teacher_id.name,
            no_of_student:class_data[i].students.length
        })
        
    }
    res.render('admin/student/stdDashboard',{class_data:data,layout:'admin/base'});
}

////// Manage student according to class ////
static manage_student_class = async (req,res)=>{
    var class_name = req.params.class;
    // var data = await teacherModel.findOne({name:class_name,statu:0});
    var classStudent_data =  await class_and_teacherModel.findOne({class_name:class_name}).populate('class_teacher_id').populate('students.student_id');
    res.render('admin/student/classStudent',{
        // data:data,
        class_data:classStudent_data,
        layout:'admin/base'});
}
// **************************XXXXX**********************


/////////////student Payment ////////////

////generate monthly payment
static generate_monthlyPayment = async (req,res)=>{
    var no_of_class= await class_and_teacherModel.find({}).countDocuments()
    var class_data =  await class_and_teacherModel.find({}).populate('class_teacher_id');
    for (let i = 0; i < no_of_class; i++) {
        for (let j = 0; j < class_data[i].students.length; j++) {
            console.log(class_data[i].class_name);
            var student_id = class_data[i].students[j].student_id
            var student_fee =await studentPaymentPaymentModel.findOne({student_id:student_id})
            // if (data==null) {
            //     var student_fee = new studentPaymentPaymentModel({
            //         student_id:student_id,
            //         class_name:class_data[i].class_name
            //     })
            //    await student_fee.save();

            // }
            console.log('student fee',student_fee);
            var student_details = await studentModel.findById(student_id)
            // console.log(student_fee.monthlypayments);
            var currentDate = new Date();
            var currYear = currentDate.getFullYear();
            var currMonth = currentDate.getMonth() + 1;
            var currDate = currentDate.getDate();
            var date_of_payment = currDate +'-'+ currMonth +'-'+ currYear
            var month =moment().format('MMMM YYYY')
            // var month = "June 2022";

            var fee_structure = await class_fee_structureModel.findOne({class_name:class_data[i].class_name})
            var monthly_fee = fee_structure.monthly_fee

            var itemIndex = student_fee.monthlypayments.find(p => p.month_of_payment == month);

            if (itemIndex) {
                console.log('data already exits',student_details.name);
            }
            else{
                console.log('data no exits',student_details.name);
                if (student_details.transport == 'yes') {
                    student_fee.monthlypayments.push({
                        monthly_fee:monthly_fee,
                        transport_fee:600,
                        month_of_payment:month,
                        date_of_payment:date_of_payment,
                        
                    })
                    await student_fee.save();
                } else {
                    student_fee.monthlypayments.push({
                        monthly_fee:monthly_fee,
                        month_of_payment:month,
                        date_of_payment:date_of_payment,
                        
                    })
                    await student_fee.save();
                }
            }
        }
    }
}

///payment dashboard//

static student_paymentdashboard = async (req,res)=>{
    this.generate_monthlyPayment(req,res)
    var data = []
    // var data = await teacherModel.find({status:0});
    var no_of_class= await class_and_teacherModel.find({}).countDocuments()
    var class_data =  await class_and_teacherModel.find({}).populate('class_teacher_id');
    for (let i = 0; i < no_of_class; i++) {
        var total_due = 0;
        var total_paid = 0;
        var amount = 0;

        for (let j = 0; j < class_data[i].students.length; j++) {
            // console.log(class_data[i].students[j].student_id);
            var student_id = class_data[i].students[j].student_id
            var student_fee =await studentPaymentPaymentModel.findOne({student_id:student_id})
            // console.log(student_fee);
            if (student_fee != null) {
            student_fee.yearlypayments.forEach(data => {
                // console.log(student_fee);
                if (data.pay_status == 0) {
                    total_due = total_due + data.admission_fee;
                    total_due = total_due + data.book_and_accessories_fee;
                    // console.log('total of admission and access fee student',total_due);
                    
                }
                else{
                    total_paid = total_due + data.admission_fee;
                    total_paid = total_due + data.book_and_accessories_fee;
                   
                }
                
            });
            student_fee.monthlypayments.forEach(data => {
                // console.log('total of monthly fee student 122222',total_due);
                if (data.payment_status == 0) {
                    total_due = total_due + data.monthly_fee;
                    total_due = total_due + data.transport_fee;
                    // console.log('total of monthly fee student',total_due);
                }
                else{
                    total_paid = total_due + data.monthly_fee;
                    total_paid = total_due + data.transport_fee;
                }
            });
            // console.log('total per student',total_due);
            amount = amount + total_due
            total_due = 0
            
        } 
    
        }
        console.log('total new admission fee',amount);
        data.push({
            class_name:class_data[i].class_name,
            class_teacher:class_data[i].class_teacher_id.name,
            no_of_student:class_data[i].students.length,
            paid:total_paid,
            due:amount,
        })
        
    }
    
    // console.log(data);
    res.render('admin/studentPayment/paymentDashboard',{fee:data,layout:'admin/base'});
}

////////////////////payment student ///////////
static student_payment = async (req,res)=>{
    var class_name = req.params.class;
    var paymentdata = []
    var no_of_student = await studentPaymentPaymentModel.find({class_name:class_name}).countDocuments();
    var student_payment_data = await studentPaymentPaymentModel.find({class_name:class_name}).populate('student_id');
    console.log(no_of_student);
    if (student_payment_data) {
        for (let i = 0; i < no_of_student; i++) {

            // console.log(student_payment_data[i]);
            student_payment_data[i].yearlypayments.forEach(data => {
                if (data.pay_status == 0) {
                    paymentdata.push({
                        roll_no:student_payment_data[i].student_id.rollno,
                        student_name:student_payment_data[i].student_id.name,
                        contact:student_payment_data[i].student_id.contact,
                        due_month:data.month_of_pay,
                        payment_purpose:'New Admission',
                        amount:data.admission_fee + data.book_and_accessories_fee,
                    })
                }
            });
            student_payment_data[i].monthlypayments.forEach(data => {
                if (data.payment_status == 0) {
                    paymentdata.push({
                        roll_no:student_payment_data[i].student_id.rollno,
                        student_name:student_payment_data[i].student_id.name,
                        contact:student_payment_data[i].student_id.contact,
                        due_month:data.month_of_payment,
                        payment_purpose:'Tuition Fee',
                        amount:data.monthly_fee + data.transport_fee,
                    })
                }
            });
            console.log('this is of student=',paymentdata);
        }
    } else {
        console.log('no payment data present');
    }
    res.render('admin/studentPayment/studentPayment',{payment:paymentdata,layout:'admin/base'});
    
}


// ***********XXXXXXXXXXXXXXXXXXX************

    ////////////staff//////////////////////
    static manageStaff = async (req,res)=>{
        var data = await staffModel.find({status:0});
        res.render('admin/staff/manageStaff',{data:data,layout:'admin/base'});
    }
    static createStaff = async (req,res)=>{
        const today = new Date();
        const yyyy = today.getFullYear();
        var mm = today.getMonth() + 1; 
        var dd = today.getDate();
        const currentDate = dd +'-'+ mm +'-'+ yyyy

        var {name,contact,gender,job,address} = req.body;
        if (name && contact && gender && job && address  ) {
            var data = new staffModel({
                name:name,
                contact:contact,
                gender:gender,
                job:job,
                doj:currentDate,
                address:address,
            })
            await data.save();
            res.redirect('/admin/manageStaff')
        } else {
            res.send('all field require');
        }
       
    }
    //////////////////manage staff payment///////////
    static staffPayment = async (req,res)=>{
        var currentDate = new Date();
        var currYear = currentDate.getFullYear();
        var currMonth = currentDate.getMonth() + 1;
        var currDate = currentDate.getDate();

        var genYear = currentDate.getFullYear();
        var genMonth = currentDate.getMonth();
        var genDate = 1;

        var date_of_payment = genDate +'-'+ currMonth +'-'+ currYear
        var diffMonth = moment([currYear,currMonth,currDate]).diff(moment([genYear,genMonth,genDate]),"months")


        var data = await staffModel.find({status:0})
        if (diffMonth == 1 ) {
            var payment = await staffPaymentModel.findOne({date_of_payment:date_of_payment})
            if (payment != null ) {
                console.log('no new payment');
                var staff_payment_data = await staffPaymentModel.find({date_of_payment:date_of_payment}).populate('staff_id')
                res.render('admin/staff/staffPayment',{data:staff_payment_data,layout:'admin/base'});
            } else {
                data.forEach(element => {
                   var payment_generated =  new staffPaymentModel({
                         staff_id:element._id,
                         amount:700,
                         date_of_payment:date_of_payment,
                        
                    })
                     payment_generated.save();
                });
                var staff_payment_data = await staffPaymentModel.find({date_of_payment:date_of_payment}).populate('staff_id')
                res.render('admin/staff/staffPayment',{data:staff_payment_data,layout:'admin/base'});
            }
        }
    }
///////////////////make payment for staff //////////////
    static makePayment_staff = async (req,res)=>{
        var id = req.params.id;
    await staffPaymentModel.findByIdAndUpdate({_id:id},{payment_status:1})
        res.redirect('/admin/managePayment')
    }

    //////////////////teacher payment generate//////
        static teacherPayment = async (req,res)=>{
            var currentDate = new Date();
            var currYear = currentDate.getFullYear();
            var currMonth = currentDate.getMonth() + 1;
            var currDate = currentDate.getDate();
    
            var genYear = currentDate.getFullYear();
            var genMonth = currentDate.getMonth();
            var genDate = 1;
    
            var date_of_payment = genDate +'-'+ currMonth +'-'+ currYear
            var diffMonth = moment([currYear,currMonth,currDate]).diff(moment([genYear,genMonth,genDate]),"months")
    
            var month = moment().format('MMMM')

            var data = await teacherModel.find({status:0})
            if (diffMonth == 1 ) {
                var payment = await teacherPaymentModel.findOne({date_of_payment:date_of_payment ,month:month})
                if (payment != null ) {
                    console.log('no new payment');
                    var teacher_payment_data = await teacherPaymentModel.find({date_of_payment:date_of_payment,month:month}).populate('teacher_id')
                    res.render('admin/teacher/teacherPayment',{data:teacher_payment_data,layout:'admin/base'});
                } else {
                    data.forEach(element => {
                       var payment_generated =  new teacherPaymentModel({
                             teacher_id:element._id,
                             amount:1300,
                             month:month,
                             date_of_payment:date_of_payment,
                            
                        })
                         payment_generated.save();
                    });
                    var teacher_payment_data = await teacherPaymentModel.find({date_of_payment:date_of_payment,month:month}).populate('staff_id')
                    res.render('admin/teacher/teacherPayment',{data:teacher_payment_data,layout:'admin/base'});
                }
            }
        }

        ///////////////////make payment for staff //////////////
    static makePayment_teacher = async (req,res)=>{
        var id = req.params.id;
    await teacherPaymentModel.findByIdAndUpdate({_id:id},{payment_status:1})
        res.redirect('/admin/manage-teacher-payment')
    }

    ////////////////////////////////teacher////////////////////////
    static manageTeacher = async (req,res)=>{
        var data = await teacherModel.find({status:0});
        res.render('admin/teacher/manageTeacher',{data:data,layout:'admin/base'});
    }
///creating new teaher ///
    static createTeacher = async (req,res)=>{
        const today = new Date();
        const yyyy = today.getFullYear();
        var mm = today.getMonth() + 1; 
        var dd = today.getDate();
        const currentDate = dd +'-'+ mm +'-'+ yyyy

        var {name,contact,gender,subject,address,email,password} = req.body;
        const hasspassword = await bcrypt.hash(password,10);
           var data = new teacherModel({
            name:name,
            contact:contact,
            gender:gender,
            subject:subject,
            email:email,
            doj:currentDate,
            address:address,
            password:hasspassword
        })
        await data.save();
        res.redirect('/admin/manageTeacher')
    }

    // *****************//////////////////// class ////////////
////////////manage class
    static manage_class_and_teacher = async (req,res)=>{
        var data = await teacherModel.find({status:0});
        var class_data =  await class_and_teacherModel.find({}).populate('class_teacher_id');
        res.render('admin/class/manageClass',{data:data,class_data:class_data,layout:'admin/base'});
    }
    ////////inserting class and class teacher
    static insert_class_teacher = async (req,res)=>{
        var {class_name,class_teacher} = req.body
        var teacher_data = await teacherModel.findOne({_id:class_teacher})
        var data = await class_and_teacherModel.findOne({class_name:class_name});
        console.log(data);
        if (data == null) {
            let class_data = new class_and_teacherModel({
                class_name:class_name,
                class_teacher_id:class_teacher,
                subject_teacher:[
                    {
                        period_name:1,
                        subject_teacher_id:class_teacher
                    }
                ]
            })
            await class_data.save().then(()=>{
                teacher_data.class_periods.push({
                    period_name:1,
                    class_name:class_name,
                    role:"Class Teacher",
                })
                teacher_data.save();
            })
            res.redirect('/admin/manageClass')
        } else {
            console.log('class already signed');
            res.redirect('/admin/manageClass')
        }
    }

// /////insert class teacher into teacher model
//     static insert_into_teacher_model =async (req,res)=>{

//     }

//   ****************add subject period**********************

//////view all class////
static viewclassdashboard = async (req,res)=>{
    var data = await teacherModel.find({status:0});
    var class_data =  await class_and_teacherModel.find({}).populate('class_teacher_id');
    res.render('admin/class/viewAllclass',{data:data,class_data:class_data,layout:'admin/base'});
    // res.send(class_data)
}


////// Manage CLass Period and teacher ////
static manage_class_period = async (req,res)=>{
    var class_name = req.params.class;
    // var data = await teacherModel.findOne({name:class_name,statu:0});
    var class_data =  await class_and_teacherModel.findOne({class_name:class_name}).populate('class_teacher_id').populate('subject_teacher.subject_teacher_id');
    res.render('admin/class/manageclassPeriod',{
        // data:data,
        class_data:class_data,
        layout:'admin/base'});
}

/////////////ajax subject and teacher ////////////
static teacher_name = async (req,res)=>{
    var teacherdata = await teacherModel.find({'subject':req.body.subject_name});
   if (teacherdata) {
       console.log('todo data is here',teacherdata);
       res.send(teacherdata)
   } else {
       console.log('error');
   }
}

static insert_subject_period = async (req,res)=>{
    var data = req.body.class_name
    var {subject ,subject_teacher } = req.body
    var class_data =  await class_and_teacherModel.findOne({class_name:data});
    var no_of_teacher = await class_data.subject_teacher.length;
    // console.log(no_of_teacher);
    var periods = await teacherModel.findById(subject_teacher)
  var result =   periods.class_periods.find((o)=> o.period_name ===no_of_teacher+1 )
  if (result === undefined) {

    periods.class_periods.push({
        period_name:no_of_teacher +1,
        class_name:data,
        role:"Subject Teacher"
    })
    periods.save().then(()=>{
        class_data.subject_teacher.push({
            period_name:no_of_teacher +1,
            subject_teacher_id:subject_teacher
        })
         class_data.save();
        // res.redirect('back')
        var message = {
            status:'success',
            msg:'Teacher Pointed Successfully'
        }
        res.send(message);
       
    })

  }
  else {
    console.log('Teacher allready had a class to attend');
    // res.redirect('back')
    var message = {
        status:'error',
        msg:'Teacher Already Scheduled For This Period'
    }
    res.send(message);
}

}


///////////////////////////payment***********************

////route for fee structure////

////class fee structure
static class_fee_structure = async (req,res)=>{
    var data = await class_fee_structureModel.find({})
    res.render('admin/payment/classFeeStructure',{data:data,layout:'admin/base'});
}

static insert_class_fee = async (req,res)=>{
    var {class_name,new_admission_fee,re_admission_fee,monthly_fee,book_and_access_fee} = req.body
    var feeData = await class_fee_structureModel.findOne({class_name:class_name});
    if (feeData == null) {
        var data = new class_fee_structureModel({
            class_name:class_name,
            new_admission_fee:new_admission_fee,
            re_admission_fee:re_admission_fee,
            monthly_fee:monthly_fee,
            book_and_access_fee:book_and_access_fee,
        })
        await data.save();
        res.redirect('/admin/classFeeStructure')
    } else {
        res.send('data already present')
    }
}

////////////////////////////ATTENDANCE//////////////////////////

////view attendance dashboard////

static generate_student_attendance = async (req,res)=>{
    var no_of_class= await class_and_teacherModel.find({}).countDocuments()
    var class_data =  await class_and_teacherModel.find({}).populate('class_teacher_id');
    if (no_of_class != 0) {
        for (let i = 0; i < no_of_class; i++){
            for (let j = 0; j < class_data[i].students.length; j++) {
                var student = class_data[i].students[j].student_id
                console.log('this is student ',student);
                var date =moment().format('LL')
                var month = moment().format('MMMM')
                // var date = "April 27, 2022";
            
                var checkAttendance = await studentAttendanceModel.findOne({date:date,class_name:class_data[i].class_name})
                // console.log(checkAttendance);
                if (checkAttendance) {
                    
                   var val = await studentAttendanceModel.findOne({"date" : date ,"class_name":class_data[i].class_name, "attendance.student_id":student})
                    // var val = await studentAttendanceModel.find({"date": date,class_name:class_data[i].class_name},{attendance:{$elemMatch:{student_id :student,status :"A"}}})
                    console.log('this is value = ',val);
                    if (val === null) {
                        console.log('create no');
                        checkAttendance.attendance.push({
                            student_id:student
                        })
                        await checkAttendance.save();
                        }
                        else{
                            console.log('data exits');
                        }
                  
                    
                } else {
                    var data = new studentAttendanceModel({
                        date:date,
                        month:month,
                        class_name:class_data[i].class_name,
                        class_teacher_id:class_data[i].class_teacher_id,
                        attendance:[
                            {
                                student_id:student
                            }
                        ]
                    })
                    await data.save();
                }
            }
            
        }
    }
    else{
        console.log('no student available in this class');
    }

}

    //////student dashboard view////
    static attendance_dashboard = async (req,res)=>{
        this.generate_student_attendance(req,res)
        var data = []
        // var data = await teacherModel.find({status:0});
        var no_of_class= await class_and_teacherModel.find({}).countDocuments()
        var class_data =  await class_and_teacherModel.find({}).populate('class_teacher_id');
        for (let i = 0; i < no_of_class; i++) {
            console.log(class_data[i].students.length);
            for (let j = 0; j < class_data[i].students.length; j++) {
                console.log(class_data[i].students[j].student_id);
                
            }
            data.push({
                class_name:class_data[i].class_name,
                class_teacher:class_data[i].class_teacher_id.name,
                no_of_student:class_data[i].students.length
            })
            
        }
        res.render('admin/Attendance/attendanceDashboard',{class_data:data,layout:'admin/base'});
    }
    
    //////////////////class wise attendance for student

    static class_attendance = async (req,res)=>{
        
            var class_name = req.params.class;
            var date =moment().format('LL')
            // var date = "April 23, 2022";
            var class_attendance = await studentAttendanceModel.findOne({date:date,class_name:class_name}).populate('attendance.student_id')
            var classStudent_data =  await class_and_teacherModel.findOne({class_name:class_name}).populate('class_teacher_id').populate('students.student_id');
            res.render('admin/Attendance/classAttendance',{
                class_data:class_attendance,
                layout:'admin/base'});
    }

   static present_student = async (req,res)=>{
    var class_name = req.params.class;
    var student_id = req.body.student_id
    var date =moment().format('LL')
    // var date = "April 23, 2022";

 await studentAttendanceModel.updateOne({"date" : date ,"class_name":class_name, "attendance.student_id":student_id}, { $set: { "attendance.$.status" : "P" } })
    // console.log(val);
     res.redirect('back')
   }

}
module.exports = AdminController