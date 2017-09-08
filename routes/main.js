const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  if (req.user) {
    return res.render('main/home');
  }
  res.render('main/landing');
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