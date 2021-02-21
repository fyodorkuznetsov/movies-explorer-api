const { celebrate, Joi } = require('celebrate');
const userAuthRouter = require('express').Router();
const {
  login, createUser,
} = require('../controllers/users.js');

userAuthRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
userAuthRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = userAuthRouter;
