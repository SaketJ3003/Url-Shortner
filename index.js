const express = require("express");
const path = require("path")
const { connectToMongoDB } = require("./connect");
const {checkForAuthentication,restrictTo} = require("./middlewares/auth");

const URL = require("./models/urls");
const State = require("./models/states");

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user')

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() => console.log("MongoDB Connected."));

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(checkForAuthentication);

app.get('/url/:shortId', async (req, res)=>{
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        }, 
        { 
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                },
            },
        }
    );

    if (!entry) {
        return res.status(404).send("Short URL not found");
    }

    res.redirect(entry.redirectURL)
})

app.post('/state', async (req, res) => {
    const { name } = req.body;
    const state = new State({ name });
    await state.save();
    res.status(201).json(state);
});

app.use("/url", restrictTo(["NORMAL","ADMIN"]), urlRoute);//handling url shortening and admin dashboard.
app.use("/user", userRoute); //handling user signup and login
app.use('/' ,staticRoute);//handling rendering of home page etc.

app.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`);
})