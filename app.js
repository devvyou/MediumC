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
    hpp = require('hpp'),
    connDb = require('./database/connectDb'),
    passport = require('passport');

// Connecting mongoose to the app
(async () => {
    await connDb();
})();


// Middlewares
// app.use(helmet({
//     hidePoweredBy: true,
//     dnsPrefetchControl: { allow: true },
//     referrerPolicy: { policy: "no-referrer", },
//     noSniff: true,
//     contentSecurityPolicy: {
//         useDefaults: true,
//         directives: {
//             "script-src": ["'self'", "https://unpkg.com/aos@next/dist/aos.js"],
//             "form-action": ["'self'"]
//         }
//     }
// }))

// app.use((req, res, next) => {
//     res.set('frame-ancestors', 'none');
//     res.set('object-src', 'none');
//     res.set('base-uri', 'none');
//     res.set('Referrer-Policy', 'no-referrer');
//     res.set('X-XSS-Protection', '1; mode=block');
//     return next();
// })

app.use(hpp());
app.use(nocache());
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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
app.use('/', require('./routes/getRoutes'));

// Init the POST Route
app.use('/', require('./routes/postRoutes'));

app.listen(process.env.PORT || 80)

