const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const DuplicateDataError = require('../errors/duplicate-data-err');
const WrongDataError = require('../errors/wrong-data-err');
const SystemError = require('../errors/system-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');

require('dotenv').config();

const { JWT_SECRET = 'eb28135ebcfc17eb28135ebcfc17eb28135ebcfc17' } = process.env;

/* регистрация */
module.exports.createUser = (req, res, next) => {
  const {
    name,
    password,
    email,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(201).send({
        data: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new DuplicateDataError('Пользователь с таким e-mail уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new WrongDataError('Переданы некорректные данные для создания пользователя'));
      } else {
        next(new SystemError('Произошла ошибка'));
      }
    });
};

/* авторизация */
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, {
        maxAge: 3600000,
        httpOnly: true,
      })
        .send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

/* выход */
module.exports.logout = (req, res) => {
  res.clearCookie('token');
  res.send({ loggedOut: true });
};

/* получение своего профиля */
module.exports.getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Ваш профиль не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

/* обновление своего профиля */
module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Ваш пользователь не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new DuplicateDataError('Пользователь с таким e-mail уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new WrongDataError('Переданы некорректные данные для обновления профиля пользователя'));
      } else {
        next(err);
      }
    });
};
