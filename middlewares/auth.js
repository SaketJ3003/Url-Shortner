const { getUser } = require("../service/auth")

function checkForAuthentication(req,res,next){
    const authHeader = req.headers?.authorization;
    const headerToken = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;
    const queryToken = req.query?.token;
    const bodyToken = req.body?.token;
    const token = headerToken || queryToken || bodyToken;

    req.user = null;
    if(!token){
        return next();
    }
    const user = getUser(token);

    req.user = user;
    return next();
}

//ADMIN, Normal
function restrictTo(roles = []) { 
    return function(req,res,next){
        if(!req.user) return res.redirect("/login");

        if(!roles.includes(req.user.role)) return res.end('Unauthorised');

        return next();
    };
}

module.exports = {
    checkForAuthentication,
    restrictTo,
}