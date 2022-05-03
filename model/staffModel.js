const mongoose = require('mongoose');

var staffSchema = mongoose.Schema({
    name:{type:String,require:true},
    contact:{type:Number,require:true},
    gender:{type:String,require:true},
    job:{type:String,require:true},
    doj:{type:String,require:true},
    address:{type:String,require:true},
    status:{type:Number,default:0}
})
var staffModel = mongoose.model('staff',staffSchema);

module.exports =staffModel;