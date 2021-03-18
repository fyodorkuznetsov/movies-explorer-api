const { celebrate, Joi } = require('celebrate');
const movieRouter = require('express').Router();

const {
  createMovie, sendMoviesData, deleteMovie,
} = require('../controllers/movies');

movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
country: Joi.string(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string(),
    description: Joi.string().required(),
    image: Joi.string(),
    trailer: Joi.string(),
    thumbnail: Joi.string(),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string(),
  }),
}), createMovie);

movieRouter.get('/movies', sendMoviesData);

movieRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = movieRouter;
