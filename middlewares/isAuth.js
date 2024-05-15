import jwt from "jsonwebtoken";

export const isAuthenticated = async(req,res,next) =>{
    //Get the token from the cookie
    const token =  req.cookies.token

    // Verify token
    const verifyToken = jwt.verify(token,"anyKey",(err,decoded)=>{
        if(err){
            return false;
        }else{
            return decoded;
        }
    });
    if(verifyToken){
        req.user = verifyToken.id;
        next();
    }else{
        return next(new Error("Not Logged In",401));
    }

    // if(!token) return next(new errorHandler("Not Logged In",401));

    // const decoded = jwt.verify(token,"anyKey");

    // req.user = await authModel.findById(decoded._id);

    // next();
}