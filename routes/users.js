const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const {
  updateProfile, getProfile, logout,
} = require('../controllers/users.js');

userRouter.get('/users/me', getProfile);
userRouter.put('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

userRouter.post('/signout', logout);

module.exports = userRouter;
