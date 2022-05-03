const mongoose = require('mongoose');

var class_and_teacherSchema = mongoose.Schema({
    class_name:{type:String,require:true},
    class_teacher_id:{type:mongoose.Schema.Types.ObjectId,ref:'teacher',require:false},
    subject_teacher:[
        {
            period_name:{type:Number,require:false},
            subject_teacher_id:{type:mongoose.Schema.Types.ObjectId,ref:'teacher',require:false},
            status:{type:String,default:0,require:false}
        }
    ],
    students:[
        {
            student_id:{type:mongoose.Schema.Types.ObjectId,ref:'student',require:false},
            std_status:{type:String,default:0,require:false}
        }
    ],
})
var class_and_teacherModel = mongoose.model('class_and_teacher',class_and_teacherSchema);

module.exports =class_and_teacherModel;