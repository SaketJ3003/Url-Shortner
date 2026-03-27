const express = require("express");
const State = require("../models/states");
const router = express.Router();

router.get('/admin/urls', async (req, res) => {
    return res.render("admin");
})

router.get('/', async (req, res) => {
    return res.render("home", {
        urls: [],
    });
})

router.get('/signup', async (req, res) => {
    const states = await State.find({ isActive: true });
    return res.render("signup", { states });
});

router.get('/login', (req,res)=>{
    return res.render("login");
})

module.exports = router;