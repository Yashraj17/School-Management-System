const mongoose = require('mongoose');

var teacherPaymentSchema = mongoose.Schema({
    teacher_id:{type:mongoose.Schema.Types.ObjectId,ref:'teacher',require:false},
    amount:{type:String,require:true},
    date_of_payment:{type:String,require:true},
    month:{type:String,require:true},
    payment_status:{type:Number,default:0},
    teacher_status:{type:Number,default:1}
})
var teacherPaymentModel = mongoose.model('teacherPayment',teacherPaymentSchema);

module.exports =teacherPaymentModel;