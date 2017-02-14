const express       = require('express'),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      flash         = require('connect-flash'),
      morgan        = require('morgan'),
      cookieParser  = require('cookie-parser'),
      bodyParser    = require('body-parser'),
      session       = require('express-session'),
      app           = express(),
      configDB      = require('./config/database');

const port = process.env.PORT || 8080;

// config & connect to database
mongoose.connect(configDB.url);

// pass passport for configuration
require('./config/passport')(passport);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get info from html forms

app.set('view engine', 'ejs'); // using ejs for templating

// required for passport
app.use(session({
  secret: 'ilovescotchscothcyscotchschotch'
})); // lame session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch
app.listen(port, () => {
  console.log(`Magic happening in port ${port}`);
});
