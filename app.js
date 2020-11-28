const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const redis = require('redis');

const app = express();
const client = redis.createClient({ host: 'redis' });
client.set('visits', 0);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  client.get('visits', (err, visits) => {
    console.log({ visits });
    res.send('Number of visits is: ' + ++visits)
    client.set('visits', visits)
  })
});
app.use('/', indexRouter);

const onProxyReq = (proxyReq, req, res) => {
  console.log('on req');
}

const onProxyRes = (proxyRes, req, res) => {
  console.log('on res');
}

const onError = (err, req, res) => {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  })
  res.end('Something went wrong. And we are reporting a custom error message.')
}

app.use(
  '/api/users',
  createProxyMiddleware({
    target: 'http://backend:3000',
    changeOrigin: true,
    onProxyReq,
    onProxyRes,
    onError
  })
)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
