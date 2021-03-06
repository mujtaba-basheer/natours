const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    console.log(message);
    return new AppError(message, 400);
  };

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    const message = `Duplicate field value: ${value[0]}. Please use another value.`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invaid Token! Please login again.', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please login again.', 401);

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
          });
    } else {              //Programming or other unknown error: don't leak error details

        // 1) Log Error
        console.error('ERROR 😵', err);

        // 2) Send generic error
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
};

module.exports = (err, req, res, next) => {
    //console.log(err.stack);
  
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        let error = { ...err };

        if (error.name === 'CastError') error = handleCastErrorDB(error);

        if (error.code === 11000) error = handleDuplicateFieldsDB(error);

        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

        if (error.name === 'JsonWebTokenError') error = handleJWTError();

        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
  };