import jwt from "jsonwebtoken"
 
const UserAuth = (req,res,next) => {
    const { token } = req.cookies;
    if (!token) {
        res.json({ success: false, message: "User not Authorized.Login Again" });
    }
    try {
         const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

      if (tokenDecode.id) {
           if (!req.body) req.body = {}; 
           req.body.userId = tokenDecode.id;
         } else {
           res.json({ success: false, message: "User not Authorized.login again" });
        }
        next();

    } catch (error) {
        console.log(error.message);
                   res.json({ success: false, message: error.message});

    }
   
}

export default UserAuth;