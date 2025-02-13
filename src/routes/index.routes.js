const express = require('express');
const router = express.Router();

const tweetRoutes = require('./tweet.routes');
const replyRoutes = require('./reply.routes');
const jobRoutes = require('./job.routes');
const configRoutes = require('./config.routes');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

router.use('/tweets', tweetRoutes);
router.use('/replies', replyRoutes);
router.use('/jobs', jobRoutes);
router.use('/config', configRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
