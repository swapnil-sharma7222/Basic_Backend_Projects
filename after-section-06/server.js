const port = process.env.PORT || 3000;
const dotnev= require('dotenv');
const express= require('express');
const mongoose= require('mongoose');
const app = express();
dotnev.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<PASSWARD>', process.env.DATABASE_PASSWORD);
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('DB connection successful!!');
}).catch(err => {
  console.log('DB connection error:', err);
});

const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.get((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);



// const test= new Tour({
//     name: "Hi",
//     price: 1000
// });

// test.save().then(e=> {
//     console.log(e);
// }).catch(err=> {
//     console.log('!!Error!!', err);
// });


