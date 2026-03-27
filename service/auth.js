const jwt =  require("jsonwebtoken");
const secret  = "Saket$123@$";


function genrateToken(user){
    // console.log("user", user);
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
    }, secret)
}

function verifyToken(token){
    if(!token) return null;
    try{
        return jwt.verify(token, secret); 
    } catch(error){
        
    }
}

module.exports = {
    genrateToken,
    verifyToken,
}