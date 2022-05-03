const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const studentModel = require('../model/studentModel')
const teacherModel = require('../model/teacherModel')

class HomeController{
    static HomePage = (req,res)=>{
        res.render('home/index',{layout:'home/layout'})
    }

    static applyPage = (req,res)=>{
        res.render('home/ApplyAdmission',{layout:'home/layout'})
    }

    static applystudent = async (req,res)=>{
        var {name,father_name,mother_name,contact,dob,gender,email,transport,class_name,address,password} = req.body;

        const hasspassword = await bcrypt.hash(password,10);
        var data = new studentModel({
            name:name,
            father_name:father_name,
            mother_name:mother_name,
            contact:contact,
            dob:dob,
            transport:transport,
            gender:gender,
            email:email,
            class_name:class_name,
            address:address,
            password:hasspassword
        });
        await data.save();
        res.redirect('/apply');
    }
    static loginPage = (req,res)=>{
        res.render('home/login',{layout:'home/layout'})
    }
            //student  login function 
           static studentLogin = async (req,res)=>{
            try {
                const {email,password} = req.body;
                if (email && password) {
                    const user = await studentModel.findOne({email:email})
                    if (user!=null) {
                        const isMatch = await bcrypt.compare(password,user.password);
                        if ((user.email == email ) && isMatch) {
                            //generate jwt token
                            const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'});
                            console.log(token);
                            res.cookie('jwt2',token)
                            res.redirect('/student')
                           
                        } else {
                            res.send({'status':'faild','message':'Email or Password does not match'})
                        }
                    } else {
                        res.send({'status':'faild','message':'You are not Registered User'})
                    }
                } else {
                    res.send({'status':'faild','message':'All field requird'})
                }
            } catch (error) {
                
            }
        }
            //student logout function
    static studentLogout = (req,res)=>{
        res.clearCookie('jwt2')
        console.log('you are logged out');
        res.redirect('/student/login')
    }
        //////////////teacher login page 
    static TeacherloginPage = (req,res)=>{
        res.render('home/teacherLogin',{layout:'home/layout'})
    }

    //// teacher login function 
    static teacherLogin = async (req,res)=>{
        try {
            const {email,password} = req.body;
            if (email && password) {
                const user = await teacherModel.findOne({email:email})
                if (user!=null) {
                    const isMatch = await bcrypt.compare(password,user.password);
                    if ((user.email == email ) && isMatch) {
                        //generate jwt token
                        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'});
                        console.log(token);
                        res.cookie('jwt1',token)
                        res.redirect('/teacher')
                       
                    } else {
                        res.send({'status':'faild','message':'Email or Password does not match'})
                    }
                } else {
                    res.send({'status':'faild','message':'You are not Registered User'})
                }
            } else {
                res.send({'status':'faild','message':'All field requird'})
            }
        } catch (error) {
            
        }
    }
                //teacher logout function
                static teacherLogout = (req,res)=>{
                    res.clearCookie('jwt1')
                    console.log('you are logged out');
                    res.redirect('/teacher/login')
                }
}
module.exports = HomeController;