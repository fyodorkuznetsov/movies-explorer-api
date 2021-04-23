const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { limiter } = require('./middlewares/limiter');
const NotFoundError = require('./errors/not-found-err');

const userAuthRouter = require('./routes/usersAuth');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const corsOptions = {
  origin: 'https://smith-movies.students.nomoredomains.monster',
  credentials: true,
};

const { PORT = 3000, NODE_ENV = 'development', DB_ADDRESS = 'mongodb://localhost:27017/exploremoviesdb' } = process.env;
const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//if (NODE_ENV === 'production') {
app.use(limiter);
app.use(cors(corsOptions));
//}
//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//res.header("Access-Control-Allow-Credentials", "true");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(requestLogger);

app.use(userAuthRouter);

app.use(auth);

app.use(userRouter);
app.use(movieRouter);

if (NODE_ENV === 'production') {
  app.get('/crash-test', () => {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  });
}

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Start successfull. Server is listening to ${PORT}.`);
});
