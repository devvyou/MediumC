// Loading environment variables
require('dotenv').config();

// Requiring all the dependencies
const express = require('express'),
    app = express(),
    nocache = require('nocache'),
    helmet = require('helmet'),
    morgan = require('morgan'),
    expressLayouts = require('express-ejs-layouts'),
    session = require('express-session'),
    MongoStore = require('connect-mongo'),
    xss = require('xss-clean'),
    hpp = require('hpp'),
    connDb = require('./database/connectDb'),
    passport = require('passport');


// Middlewares
app.use(helmet.hidePoweredBy());
app.use(hpp());
app.use(xss());
app.use(nocache());
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Connecting mongoose to the app
(async () => {
    await connDb();
})();


// Requiring passport.js file
require('./passport');


// Init express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        dbName: process.env.DB_NAME
    })
}))


// Setting passport js
app.use(passport.initialize());
app.use(passport.session());


// Local Variables
app.use((req, res, next) => {
    res.locals.authenticated = req.isAuthenticated();
    res.locals.user = req.user;
    return next();
})


// Init the GET Route
app.use('/', require('./routes/getRoutes'))

// Init the POST Route
app.use('/', require('./routes/postRoutes'))


if (process.env.NODE_ENV === 'development') {

    app.use(morgan('dev'));
    app.listen(process.env.PORT, () => {
        console.log('Tappetaio - Development: Listening on the port: ', process.env.PORT);
    })

} else {
    app.listen(process.env.PORT, () => {
        console.log('Tappetaio - Build: Listening on the port: ', process.env.PORT);
    })
}


// Error Handling
// app.use((err, req, res, next) => {

    // console.log(err.statusCode);
    // res.status(err.status || 500);

    // if (err.status == undefined) {
    //     return res.render('404', {
    //         status: 500,
    //         message: 'Internal Server Error',
    //         layout: 'layouts/withoutFooter'
    //     })
    // } else {
    //     return res.render('404', {
    //         status: err.status,
    //         message: err.message,
    //         layout: 'layouts/withoutFooter'
    //     })
    // }

// })


