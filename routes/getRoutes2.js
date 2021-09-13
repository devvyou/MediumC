const csurf = require('csurf'),
    { Router } = require('express'),
    router = Router();

router.get('/', (req, res) => res.send('yo'))

module.exports = router;