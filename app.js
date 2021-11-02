const cluster = require('cluster');
const totalCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });

} else {
    start();
}

function start() {

    // Loading environment variables
    require('dotenv').config();

    // Requiring all the dependencies
    const express = require('express'),
        app = express(),
        nocache = require('nocache'),
        { dnsPrefetchControl, noSniff, hsts, referrerPolicy, contentSecurityPolicy } = require('helmet'),
        expressLayouts = require('express-ejs-layouts'),
        expressSession = require('express-session'),
        MongoStore = require('connect-mongo'),
        hpp = require('hpp'),
        connDb = require('./database/connectDb'),
        passport = require('passport'),
        compression = require('compression'),
        rateLimiter = require('express-rate-limit'),
        MongoLimiterStore = require('rate-limit-mongo');

    // GZIP
    app.use(compression());


    // Connecting mongoose to the app
    (async () => {
        await connDb();
    })();


    // Security middlewares and headers
    app.use((req, res, next) => {

        dnsPrefetchControl()
        hsts()
        referrerPolicy({ policy: 'no-referrer' })
        noSniff()

        contentSecurityPolicy({
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
        })

        res.set('object-src', 'none');
        res.set('base-uri', 'none');
        res.set('Referrer-Policy', 'no-referrer');
        res.set('X-XSS-Protection', '1; mode=block');

        res.locals.cspNonce = require('crypto').randomBytes(16).toString('base64');

        return next();

    })

    // Other middlewares
    app.disable('x-powered-by')
    app.use(hpp());
    app.use(nocache());
    app.set('view engine', 'ejs');
    app.use(expressLayouts);
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.set('trust proxy', 1)


    // Requiring passport.js file
    require('./passport');

    const mongoStoreOptions = {
        mongoUrl: process.env.MONGO_URI,
        dbName: process.env.DB_NAME,
    }

    // Init express-session
    app.use(expressSession({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore(mongoStoreOptions)
    }))


    // Setting passport js
    app.use(passport.initialize());
    app.use(passport.session());

    // Rate-limiter for ddos attacks
    app.use(new rateLimiter({
        max: 10,
        windowMs: 10000,
    }))

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


    app.listen(process.env.PORT || 80, () => {
        console.log('the server is listening')
    })

}




