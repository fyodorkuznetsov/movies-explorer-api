const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const pattern = /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*#?$/;
        return pattern.test(v);
      },
      message: 'Некорректный формат ссылки на постер',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const pattern = /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*#?$/;
        return pattern.test(v);
      },
      message: 'Некорректный формат ссылки на трейлер',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const pattern = /^https?:\/\/([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*#?$/;
        return pattern.test(v);
      },
      message: 'Некорректный формат ссылки на превью',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
