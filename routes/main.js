const router = require('express').Router();
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

        console.log(tweets);
        res.render('main/home', { tweets });
      });
  } else {
    res.render('main/landing');
  }
});

router.get('/create-new-user', (req, res, next) => {
  const user = new User();
  user.email = 'asd@gmail.com';
  user.name = 'asd';
  user.password = 'pass';

  user.save(function(err) {
    if (err) {
      return next(err);
    }

    res.json('Successfully created.');
  });
});

module.exports = router;
