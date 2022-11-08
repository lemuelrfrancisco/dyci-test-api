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
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      console.log(fetchedUser);
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      if (fetchedUser) {
        const token = jwt.sign(
          {
            userId: fetchedUser._id,
            email: fetchedUser.email,
            firstName: fetchedUser.firstName,
            middleName: fetchedUser.middleName,
            lastName: fetchedUser.lastName,
            contactNo: fetchedUser.contactNo,
          },
          process.env.JWT_KEY,
          { expiresIn: '24h' }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600 * 24,
          userId: fetchedUser._id,
        });
      }
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!',
      });
    });
};
