import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const authMiddleware = async (req,res,next) => {
    try {
        const token  = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({success:false, message:"Unauthorized"});   
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded._id);
        if(!user){
            return res.status(401).json({success:false, message:"Unauthorized1"});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Internal server error"});
    }
}


export default authMiddleware;