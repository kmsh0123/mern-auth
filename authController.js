import authModel from "./models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const max = 30;
const min = 5


export const register = async(req,res) =>{
    const {username,email,password} = req.body;
//Validation
    if(!username){
       return res.status(400).json({error : true , message : "UserName is required"});
    }
    if(!email){
        return res.status(400).json({error : true ,message : "Email is required"});
     }
     if(!password){
        return res.status(400).json({error : true ,message : "Password is required"});
     }

     if(password.length < min){
      return res.status(400).json({error : true ,message : "Password is min 5"});
   }

   if(password.length > max){
      return res.status(400).json({error : true ,message : "Password is max 30"});
   }

//UserExisted
     const userExist = await authModel.findOne({ email : email });
     if(userExist){
        return res.json({error : true ,message : "Email already existed"});
     }

     //Hash the user password
     const salt = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(password,salt);

     //Create the User
     const userCreated = await authModel.create({
        username,
        password : hashedPassword,
        email,
     });
     //Generate Token
      const token = jwt.sign({id : userCreated._id},"anyKey",{expiresIn : "30d"})

    res.status(200).json({
        message : `${userCreated.username} register successfully`,
       data : {
        username : userCreated.username,
        email : userCreated.email,
        id : userCreated.id,
       },
       token
    });
}

export const login = async(req,res) =>{
    const {email,password} = req.body;
//Validation
     if(!email){
         return res.status(400).json({error : true ,message : "Email is required"});
      }
      if(!password){
         return res.status(400).json({error : true ,message : "Password is required"});
      }

//UserExisted
    const userinfo = await authModel.findOne({ email : email });
     if(!userinfo){
        return res.status(400).json({message : "Email not found"});
     }

//Password is valid
     const isMatch = await bcrypt.compare(password,userinfo.password);
     if(!isMatch){
        return res.status(400).json({message : "Password not match"});
     }

     //Generate the token
   const token = jwt.sign({id : userinfo._id},"anyKey",{expiresIn : "30d"})
     
   //Send to respond
      res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 })
      .json({
        message : `Login successfully`,
        token,
       id:userinfo._id,
       email:userinfo.email,
       username:userinfo.username
     })
}

export const logout = async (req, res) => {
   res
   .clearCookie('token', { httpOnly: true, secure: false })
   .json({message : "Logout Successfully"});
};

export const profile = async (req, res) => {
   try {
      const user = await authModel.findById(req.user).select('-password');
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
}
 


