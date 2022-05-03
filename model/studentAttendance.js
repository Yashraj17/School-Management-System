const mongoose = require('mongoose')

const studentAttendanceSchema = mongoose.Schema({
    date:{type:String,required:true},
    month:{type:String,required:true},
    class_name:{type:String,required:true},
    class_teacher_id:{type:mongoose.Schema.Types.ObjectId,ref:'teacher'},
    attendance:[
        {
            student_id:{type:mongoose.Schema.Types.ObjectId,ref:'student'},
            status:{type:String,default:'A',require:true}
        }
    ],
})
const studentAttendanceModel = mongoose.model('studentAttendance',studentAttendanceSchema);
module.exports= studentAttendanceModel;