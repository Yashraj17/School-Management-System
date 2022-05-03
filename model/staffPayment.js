const mongoose = require('mongoose');

var staffPaymentSchema = mongoose.Schema({
    staff_id:{type:mongoose.Schema.Types.ObjectId,ref:'staff',require:false},
    amount:{type:String,require:true},
    date_of_payment:{type:String,require:true},
    payment_status:{type:Number,default:0},
    emp_status:{type:Number,default:1}
})
var staffPaymentModel = mongoose.model('staffPayment',staffPaymentSchema);

module.exports =staffPaymentModel;