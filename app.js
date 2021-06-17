require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const CONFIG = require('./config/application.config');
const logger = require('./config/winston.config');
const handleErrors = require('./utilities/handleErrors');

// DB Connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose
  .connect(CONFIG.DBURL)
  .then(() => {
    logger.log(
      'info',
      'Successfully connected to the database -- ' + CONFIG.DBURL
    );
  })
  .catch(err => {
    logger.log(
      'error',
      'Could not connect to the database. Exiting now...',
      err
    );
    process.exit();
  });

// All routes from the modules will be interconnected here in Index file
const userRouter = require('./modules/user/user.routes');
const adminRouter = require('./modules/user/admin/admin.routes');
const fileRouter = require('./modules/fileUploads/fileupload.routes');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Enable CORS for complete application
app.use(cors());
// Route Call
app.use('/', adminRouter, userRouter, fileRouter);

// Handle the errors
app.use(handleErrors);
app.use(function(req, res, next) {
  res.status(404).send({
    status: 'error',
    statusCode: 404,
    message: "Sorry can't find that!",
  });
});

module.exports = app;
