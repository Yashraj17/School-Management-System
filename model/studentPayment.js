const mongoose = require('mongoose');

var studentPaymentSchema = mongoose.Schema({
    student_id:{type:mongoose.Schema.Types.ObjectId,ref:'student',require:false},
    class_name:{type:String,require:true},
    yearlypayments:[
        {
            admission_fee:{type:Number,default:0,require:true},
            book_and_accessories_fee:{type:Number,default:0,require:true},
            session_year:{type:Number,default:0},
            month_of_pay:{type:String,default:0},
            date_of_pay:{type:String,require:true},
            pay_status:{type:Number,default:0},
        }
    ],
    
    monthlypayments:[
        {
            
            monthly_fee:{type:Number,default:0,require:true},
            transport_fee:{type:Number,default:0,require:true},
            month_of_payment:{type:String,default:0},
            date_of_payment:{type:String,require:true},
            payment_status:{type:Number,default:0,require:true},
        }
    ],

})
var studentPaymentPaymentModel = mongoose.model('studentPayment',studentPaymentSchema);

module.exports =studentPaymentPaymentModel;