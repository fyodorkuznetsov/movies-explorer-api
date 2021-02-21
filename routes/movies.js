const { celebrate, Joi } = require('celebrate');
const movieRouter = require('express').Router();

const {
  createMovie, sendMoviesData, deleteMovie,
} = require('../controllers/movies');

movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*#?$/),
    trailer: Joi.string().required().pattern(/^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*#?$/),
    thumbnail: Joi.string().required().pattern(/^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*#?$/),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movieRouter.get('/movies', sendMoviesData);

movieRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = movieRouter;
