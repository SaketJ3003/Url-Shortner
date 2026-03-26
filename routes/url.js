const express = require('express');
const { handleGenrateNewShortURL, handleGetAnalytics } = require('../controllers/url');
const URL = require('../models/urls');
const { restrictTo } = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res) => {
	const urls = await URL.find({ createdBy: req.user._id });
	return res.json({ urls });
});

router.get('/admin/urls', restrictTo(['ADMIN']), async (req, res) => {
	const urls = await URL.find({});
	return res.json({ urls });
});

router.post("/", handleGenrateNewShortURL);

router.get('/analytics/:shortId', handleGetAnalytics);

module.exports = router;