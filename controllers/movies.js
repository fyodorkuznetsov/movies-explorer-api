const Movie = require('../models/movie');
const WrongDataError = require('../errors/wrong-data-err');
const SystemError = require('../errors/system-err');
const NotFoundError = require('../errors/not-found-err');

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError('Переданы некорректные данные для создания фильма'));
      } else {
        next(new SystemError('Произошла ошибка'));
      }
    });
};

module.exports.sendMoviesData = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movieList) => res.send({ data: movieList }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findOneAndRemove({ _id: req.params.movieId, owner: req.user._id })
    .orFail(new NotFoundError('У вас нет фильма с таким id'))
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch(next);
};
