import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true
    },
    profilePic:{
        type: String,   
        required: false
    }
}, { timestamps: true });


userSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10)
   // next();
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email
    },
    process.env.JWT_SECRET_KEY,
    {
        expiresIn:'1d'      
    }
)
}


const User = mongoose.model('User', userSchema);

export default User;