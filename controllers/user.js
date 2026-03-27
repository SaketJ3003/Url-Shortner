const User = require("../models/user");
const { verifyToken, genrateToken } = require("../service/auth");

async function handleUserSignup(req, res) {
    const { name, email, password, state, city } = req.body;

    await User.create({
        name,
        email,
        stateId: state,
        city,
        password,
    });
    return res.redirect("/");
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({
            error: "Email and Password are required",
        });
    }
    
    if(!(await User.findOne({ email }))) {
        return res.status(401).json({
            error: "Email Not Found, Please Sign Up",
        });
    }

    const user = await User.matchPassword(email,password);
    // console.log(user);
    if(!user) {
        return res.status(401).json({
            error: "Invalid Password",
        });
    }

    const token = genrateToken(user);
    return res.status(200).json({ token });
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
}