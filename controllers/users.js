const User = require('../models').User;
exports.getUsers = (req, res) => {
  User.findAll().then(
    (users) => {
      res.status(200).json(users);
    },
    (error) => {
      res.status(500).send(error);
    }
  );
};
exports.getUser = (req, res) => {
  User.findOne({ where: { username: req.params.username } }).then(
    (user) => {
      if (user != null) res.status(200).json(user);
      else res.json({ status: 0, data: 'user not found' });
    },
    (err) => {
      res.status(500).send(err);
    }
  );
};
exports.createUser = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ where: { username: username } }).then((user) => {
    if (user === null) {
      User.create({ username: username, password: password }).then(
        (user) => {
          res.status(200).json({ status: 1, data: 'user created' });
        },
        (error) => {
          res.status(500).send(error);
        }
      );
    } else {
      res.json({ status: 0, debug_data: 'username already exists' });
    }
  });
};
exports.editUser = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ where: { username: req.params.username } }).then((user) => {
    if (user !== null) {
      User.update(
        { username: username, password: password },
        { where: { username: req.params.username } }
      ).then(
        (user) => {
          res.status(200).json({ status: 1, data: 'user details modified' });
        },
        (err) => {
          res.status(500).send(err);
        }
      );
    } else {
      res.json({ status: 0, debug_data: 'user not found' });
    }
  });
};
exports.deleteUser = (req, res) => {
  User.destroy({ where: { username: req.params.username } }).then(
    (user) => {
      if (user === 0)
        res.status(500).json({ status: 0, debug_data: 'user not found' });
      else {
        res.status(200).json({ status: 1, data: 'user deleted successfully' });
      }
    },
    (err) => {
      res.status(500).send(err);
    }
  );
};
exports.checkLogin = async (req, res) => {
  const user = await User.findOne({ where: { username: req.body.username } });
  if (user !== null) {
    if (user.password === req.body.password) {
      req.session.LoggedIn = 1;
      req.session.user = user;
      res.status(200).json({ status: 1, data: 'login successful' });
    } else {
      req.session.LoggedIn = 0;
      res.json({ status: 0, debug_data: 'invalid user credentials' });
    }
  } else {
    res.json({ status: 0, debug_data: 'user not found' });
  }
};
exports.loginUser = (req, res) => {
  if (req.session.LoggedIn === 1) {
    res.json({ userOb: req.session.user });
  } else {
    res.json({ status: 0, debug_data: 'user is not logged in' });
  }
};
