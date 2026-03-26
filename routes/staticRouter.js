const express = require("express");

const router = express.Router();

router.get('/admin/urls', async (req, res) => {
    return res.render("admin");
})

router.get('/', async (req, res) => {
    return res.render("home", {
        urls: [],
    });
})

router.get('/signup', (req,res)=>{
    return res.render("signup");
})

router.get('/login', (req,res)=>{
    return res.render("login");
})

module.exports = router;