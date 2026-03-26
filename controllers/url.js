const { nanoid } = require("nanoid");
const URL = require('../models/urls');

async function handleGenrateNewShortURL(req, res){
    const body = req.body;
    if(!body.url) return res.status(400).json({ error: 'URL is required'});
    const shortID = nanoid(8);

  	const urls = await URL.find(
        { 
            createdBy: req.user._id, 
            redirectURL: body.url,
        }
    );
    // console.log(urls.length);
    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    if(!urlRegex.test(body.url)){
        return res.status(400).json({ error: `Enter Valid URL`});
    }
    // console.log(urlRegex.test(body.url))
    if(urls.length > 0){
        return res.status(400).json({ error: `${body.url} is already shortened.`}); 
    }


    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,
    });
    return res.status(201).json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });  
    return res.json(
        {
            totalClicks: result.visitHistory.length,
            analytics: result.visitHistory,
        }
    )
}

module.exports = {
    handleGenrateNewShortURL,
    handleGetAnalytics,

};