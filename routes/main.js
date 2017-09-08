const router = require('express').Router();
const async = require('async');
const User = require('../models/user');
const Tweet = require('../models/tweet');

router.get('/', (req, res) => {
  if (req.user) {
    Tweet.find({})
      .sort('-created')
      .populate('owner')
      .exec((err, tweets) => {
        if (err) {
          return next(err);
        }

        // console.log(tweets);
        res.render('main/home', { tweets });
      });
  } else {
    res.render('main/landing');
  }
});

router.get('/user/:id', (req, res) => {
  async.waterfall([
    callback => {
      Tweet.find({ owner: req.params.id })
        .populate('owner')
        .exec((err, tweets) => {
          callback(err, tweets);
        });
    },
    (tweets, callback) => {
      User.findOne({ _id: req.params.id })
        .populate('following')
        .populate('followers')
        .exec((err, user) => {
          res.render('main/user', { foundUser: user, tweets: tweets });
        });
    }
  ]);
});

module.exports = router;
