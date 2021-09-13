const csurf = require('csurf'),
    { Router } = require('express'),
    router = Router();

const Admin = require('../database/models/Admin');

router.get('/', (req, res) => {
    res.send(Admin)
})

router.get('/b', async (req, res) => {
    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    return res.render('home', {
        layout: 'layouts/footerAos',
        msg: admin[0].broadcast,
        title: 'MediumC | Landing Page'
    })
})

module.exports = router;