import jwt from 'jsonwebtoken'

const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    //"Bearer dkfjadslfdfaskldfjalsdfjadsflasdkjfadslfh"
    if(!authHeader){
       return res.status(401).json({message:"Access denied, token missing"})
    }

    const [scheme,token]=authHeader.split(' ');
    
    if(scheme!=='Bearer' || !token){
        return res.status(401).json({message:"Invalid authorization format"})
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        req.user=decoded             //req.user={userID:'dfasdfadfa}
        next()

    } catch (error) {
        return res.status(401).json({message:"Invalid or expired token"})
    }
    

}

export default authMiddleware