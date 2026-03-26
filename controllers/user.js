const User = require("../models/user");
const { setUser, getUser } = require("../service/auth");

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    await User.create({
        name,
        email,
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
    const user = await User.matchPassword(email,password);
    // console.log(user);
    if(!user) {
        return res.status(401).json({
            error: "Invalid Username or Password",
        });
    }

    const token = setUser(user);
    return res.status(200).json({ token });
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
}