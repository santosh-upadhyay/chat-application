import User from "../models/user.model.js";
import validator from 'validator';
// import valdator from 'validator';

const loginUser = async( req, res) => {
    try{
    const {email,password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all the fields" });
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({success:false, message:"User does not exist"});
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        return res.status(400).json({success:false, message:"Invalid email or password credentials"});    
    }
//    console.log(process.env.JWT_SECRET_KEY);
        const token = user.generateToken();
//  console.log(user);
    return res.json({success:true, message:"User logged in successfully", token, status:200});
    // Handle user login logic here
}catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const registerUser = async(req, res) => {
    try{
    const{firstname,lastname,email,password} = req.body;
    console.log(firstname,lastname,email,password);
    if(!firstname || !lastname || !email || !password){
       return res.status(400).json({message:"Please fill all the fields"});
    }
    const user =  await User.findOne({email});
    if(user){
        return res.status(400).json({success:false, message:" my user User already exists"});
    }
    // validating email format strong password
    if(!validator.isEmail(email)){
        return res.status(400).json({success:false, message:"Invalid email format"});
    }

    if(!validator.isStrongPassword(password)){
        return res.status(400).json({success:false, message:`Password must be at least 8 characters long and contain at least one
             uppercase letter, one lowercase letter, one number, and one symbol`});
    }

    const newUser = new User({
        firstname,
        lastname,
        email,
        password
    })

    await newUser.save()

    return res.json({success:true, message:"User registered successfully", status:201});
}
catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error- ${error.message}`
        });
    }}


// get details of current logged in user

const getCUrrentUser =  async(req,res)=>{
    try {
        // const user = req.user;
        const user = await User.findOne({_id:req.user._id}).select("-password");
        // console.log(user);
        return res.status(200).json({success:true, message:"Current user details", data:user});
    } catch (error) {        
        console.log(error);
        return res.status(500).json({success:false, error: error.message, message:"Internal server error"});
    }
}

const getAllUsers = async(req,res) => {
    try {
        const users = await User.find({_id:{$ne:req.user._id}}).select("-password");  
        return res.status(200).json({success:true, data:users});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal server error"});
    }       
}
export {
    registerUser,
    loginUser,
    getCUrrentUser,
    getAllUsers
}