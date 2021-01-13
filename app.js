const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/apperror');
const errorHandler = require ('./controllers/errorcontroller');
const tourRoute = require('./routes/tour-route');
const userRoute = require('./routes/user-route');

const app = express();

// Middlewares
// console.log(process.env.NODE_ENV);

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// Route handlers

// Routes

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
 
  // const err = new Error(`This Route ${req.originalUrl} doesn't exist`);
  // err.status= 'fail';
  // err.statusCode = 404;
  
  next(new AppError(`This Route ${req.originalUrl} doesn't exist`, 404));
});

app.use(errorHandler);

// Start the server
module.exports = app;

