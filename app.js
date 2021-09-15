// Loading environment variables
require('dotenv').config();


// Requiring all the dependencies
const express = require('express'),
    app = express(),
    nocache = require('nocache'),
    helmet = require('helmet'),
    expressLayouts = require('express-ejs-layouts'),
    session = require('express-session'),
    MongoStore = require('connect-mongo'),
    hpp = require('hpp'),
    connDb = require('./database/connectDb'),
    passport = require('passport'),
    compression = require('compression');

// Connecting mongoose to the app
(async () => {
    await connDb();
})();

app.use((req, res, next) => {
    res.set('object-src', 'none');
    res.set('base-uri', 'none');
    res.set('Referrer-Policy', 'no-referrer');
    res.set('X-XSS-Protection', '1; mode=block');
    return next();
})

app.use((req, res, next) => {
    res.locals.cspNonce = require('crypto').randomBytes(16).toString('base64');
    return next();
})

// Middlewares
app.use(helmet({
    hidePoweredBy: true,
    dnsPrefetchControl: { allow: true },
    referrerPolicy: { policy: "no-referrer", },
    noSniff: true,
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "script-src":
                [
                    "'self'",
                    "https://unpkg.com/aos@next/dist/aos.js",
                    "https://cdn.iubenda.com/iubenda.js",
                    "https://cdn.iubenda.com",
                    (req, res) => `'nonce-${res.locals.cspNonce}'`
                ],
            "form-action": ["'self'"],
            "img-src":
                ["'self'",
                    "data:",
                    "https://cdn.iubenda.com/close.png",
                ],
            "frame-src":
                [
                    "'self'",
                    "https://www.iubenda.com"
                ],
            "worker-src": ["'none'"]
        }
    }
}))

app.use(hpp());
app.use(nocache());
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());


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
});


// Init the GET Route
app.use('/', require('./routes/getRoutes'));

// Init the POST Route
app.use('/', require('./routes/postRoutes'));


app.listen(process.env.PORT || 80)

