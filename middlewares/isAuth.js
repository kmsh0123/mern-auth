import jwt from "jsonwebtoken";

export const isAuthenticated = async(req,res,next) =>{

    const token = req.headers["authorization"]?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }
    try {
        const decoded = jwt.verify(token,"anyKey");
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ message: 'Invalid Token' });
    }
    return next();
}