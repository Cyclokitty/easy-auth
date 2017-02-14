module.exports = (app, passport) => {
  // home page with login links
  app.get('/', (req, res) => {
    res.render('index.ejs');
  });

  // show login forms
  app.get('/login', (req, res) => {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  // process the login forms
  //app.post('/login', do all passport stuff

  // show the signup form
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here)

  // profile section
  // we want this protected so you have to be logged in to see it
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) return next();

    // if they aren't redirect to home page
    res.redirect('/');
  }

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an errors
    failureFlash: true // allow flash messages
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an errors
    failureFlash: true // allow messages
  }));

}
