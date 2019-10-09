const express = require('express');
const morgan = require('morgan');
const app = express();
var bodyParser = require('body-parser');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1)MIDDLEWARES

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//     res.status(200).json({message: 'Hello from the server side!', app: 'Natours'});
// });

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...')
// })



//2)ROUTE HANDLERS



// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//3)ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// app
//   .route('/api/v1/tours')
//   .get(getAllTours)
//   .post(createTour);





//original API without refactoring route
// app.delete('/api/v1/tours/:id', (req,res) => {

//     if(req.params.id*1 > tours.length) {
//            return res.status(404).json({
//                status: 'fail',
//                message: 'Invalid ID'
//            })
//        }

//    res.status(204).json({
//        status: 'success',
//        data: null
//    });
// });

module.exports = app;

//////////////////////////////////
