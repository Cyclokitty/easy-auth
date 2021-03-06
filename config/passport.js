const LocalStrategy = require('passport-local').Strategy,
      User          = require('../app/models/user');

module.exports = (passport) => {
  // passport session startup
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });


  // local signup
  passport.use('local-signup', new LocalStrategy({
    //  by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    function(req, email, password, done) {
      // User.findOne won't fire unless data is sent back
      process.nextTick(() => {
        // find a user whose email is the same as the forms email
        // if there are any errors, return the errors
      User.findOne({'local.email': email}, (err, user) => {


        if (err) return done(err);

        // check to see if there's already a user with that email
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken'))
        } else {
          // if there is no user with that email
          // create the user
          const newUser = new User();

          // set the user's local credentials
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);

          // save the user
          newUser.save((err) => {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  // local login
  passport.use('local-login', new LocalStrategy({
    // by default local strategy uses username and password an we'll override it with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  function(req, email, password, done) {
    // find a user whose email is the same as the forms email// we are checking to see if the user tyring to login already exists
    User.findOne({'local.email': email}, (err, user) => {
      // error handling
      if (err)
        return done(err);
      // if no user is found, return the message
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      // if the user is found but the password is wrong
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

      // all is well, return successful user
      return done(null, user);
    });
  }));
};
