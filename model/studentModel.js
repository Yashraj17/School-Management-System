const mongoose = require('mongoose');

var StudentSchema = mongoose.Schema({
    name:{type:String,require:true},
    father_name:{type:String,require:true},
    mother_name:{type:String,require:true},
    contact:{type:Number,require:true},
    email:{type:String,require:true},
    dob:{type:String,require:true},
    gender:{type:String,require:true},
    class_name:{type:String,require:true},
    address:{type:String,require:true},
    password:{type:String,require:true},
    rollno:{type:String,require:false},
    book_and_accessories:{type:String,require:false},
    admission_type:{type:String,require:false},
    transport:{type:String,require:false},
    date_of_admission:{type:String,require:false},
    admission_status:{type:Number,default:0}
})
var StudentModel = mongoose.model('student',StudentSchema);

module.exports =StudentModel;