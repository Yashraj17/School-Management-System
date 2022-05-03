const mongoose = require('mongoose');

var teacherSchema = mongoose.Schema({
    name:{type:String,require:true},
    contact:{type:Number,require:true},
    gender:{type:String,require:true},
    subject:{type:String,require:true},
    doj:{type:String,require:true},
    address:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    status:{type:Number,default:0},
    class_periods:[
        {
            period_name:{type:Number,require:false},
            class_name:{type:String,require:false},
            role:{type:String,default:"Subject Teacher",require:false}
        }
    ],
})
var teacherModel = mongoose.model('teacher',teacherSchema);

module.exports =teacherModel;