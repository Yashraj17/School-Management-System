const jwt = require('jsonwebtoken');
const studentModel = require('../model/studentModel');
const teacherModel = require('../model/teacherModel');

var studentAuth = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt2
        if (token !=null) {
            const verifyUser = jwt.verify(token,process.env.JWT_SECRET_KEY);
            const data = await studentModel.findById(verifyUser.userId).select('-password')
            if (data!=null) {
                console.log(data);
                req.user = data
            next()
            } else {
                res.send('You are Unauthorized')
            }
            
        } else {
            res.redirect('/student/login')
        }
     
    } catch (error) {
        console.log(error.message);
        
    }
    
}
var teacherAuth = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt1
        if (token !=null) {
            const verifyUser = jwt.verify(token,process.env.JWT_SECRET_KEY);
            const data = await teacherModel.findById(verifyUser.userId).select('-password')
            if (data!=null) {
                console.log(data);
                req.user = data
            next()
            } else {
                res.send('You are Unauthorized')
            }
            
        } else {
            res.redirect('/teacher/login')
        }
     
    } catch (error) {
        console.log(error.message);
        
    }
    
}

module.exports = {
    studentAuth,
    teacherAuth
}