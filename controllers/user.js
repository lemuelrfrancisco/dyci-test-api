const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      contactNo: req.body.contactNo,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: 'User created!',
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Invalid authentication credentials!',
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  // res.header('Access-Control-Allow-Methods', 'POST');
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed. Incorrect Email or password.',
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          role: fetchedUser.role,
        },
        process.env.JWT_KEY,
        { expiresIn: '3h' }
      );
      // res.header('token', token);
      res.status(200).json({
        token: token,
        userId: fetchedUser._id,
        expiresIn: 10800,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Auth failed. Incorrect Email or password.',
      });
    });
};
