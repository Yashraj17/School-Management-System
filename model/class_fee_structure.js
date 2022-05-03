const mongoose = require('mongoose');

class_fee_structureSchema = mongoose.Schema({
    class_name:{type:String,require:true},
    new_admission_fee:{type:Number,require:true},
    re_admission_fee:{type:Number,require:true},
    monthly_fee:{type:Number,require:true},
    book_and_access_fee:{type:Number,require:true},
})
var class_fee_structureModel = mongoose.model('class_fee_structure',class_fee_structureSchema);


module.exports =class_fee_structureModel;