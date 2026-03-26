const { getUser } = require("../service/auth")

function checkForAuthentication(req,res,next){
    const authHeader = req.headers?.authorization;
    // console.log("authHeader:",authHeader)
    const bearerMatch = authHeader && authHeader.match(/^Bearer\s+(.+)$/i);
    // console.log("bearer Mathc:",bearerMatch)
    const headerToken = bearerMatch ? bearerMatch[1] : null;
    const token = headerToken;

    // console.log('token:',token);
    
    req.user = null;
    if(!token){
        return next();
    }
    const user = getUser(token);

    req.user = user;

    // console.log("User:",req.user);

    return next();
}

//ADMIN, Normal
function restrictTo(roles = []) { 
    return function(req,res,next){
        if(!req.user) return res.redirect("/login");

        if(!roles.includes(req.user.role)) return res.status(403).send('Unauthorized');

        return next();
    };
}

module.exports = {
    checkForAuthentication,
    restrictTo,
}