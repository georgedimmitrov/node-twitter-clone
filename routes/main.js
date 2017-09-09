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
        .populate('following followers')
        // .populate('followers')
        .exec((err, user) => {
          const isFollower = user.followers.some(friend => friend.equals(req.user._id));

          let currentUser;

          if (req.user._id.equals(user._id)) {
            currentUser = true;
          } else {
            currentUser = false;
          }

          res.render('main/user', { foundUser: user, tweets: tweets, currentUser, isFollower });
        });
    }
  ]);
});

router.post('/follow/:id', (req, res, next) => {
  async.parallel([
    callback => {
      User.update(
        {
          _id: req.user._id,
          following: { $ne: req.params.id } // $ne prevents duplication of already existing data
        },
        {
          $push: { following: req.params.id }
        },
        (err, count) => {
          callback(err, count);
        }
      );
    },

    callback => {
      User.update(
        {
          _id: req.params.id,
          followers: { $ne: req.user._id }
        },
        {
          $push: { followers: req.user._id }
        },
        (err, count) => {
          callback(err, count);
        }
      );
    }
  ], (err, results) => {
    if (err) {
      return next(err);
    }

    res.json('Success');
  });
});

router.post('/unfollow/:id', (req, res, next) => {
  async.parallel([
    callback => {
      User.update(
        {
          _id: req.user._id
        },
        {
          $pull: { following: req.params.id }
        },
        (err, count) => {
          callback(err, count);
        }
      );
    },

    callback => {
      User.update(
        {
          _id: req.params.id
        },
        {
          $pull: { followers: req.user._id }
        },
        (err, count) => {
          callback(err, count);
        }
      );
    }
  ], (err, results) => {
    if (err) {
      return next(err);
    }

    res.json('Success');
  });
});

module.exports = router;
