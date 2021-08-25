const csurf = require('csurf'),
    { Router } = require('express'),
    router = Router(),
    csurfProtection = csurf();


// Requiring GET Controllers
const {

    renderHome,
    renderDashboard,
    renderAdminForm,

    renderCatalogo,
    renderCatalogoOccidentale,
    renderCatalogoOrientale,

    renderFilterOccidentale,
    renderFilterOrientale,

    renderProductOccidentale,
    renderProductOrientale,

    deleteProduct,
    deleteBroadcast,

    logout,
    errorController,

} = require('../controllers/getControllers')


// Landing Page route
router.get('/', renderHome)
router.get('/home', renderHome)
router.get('/homepage', renderHome)

// Admin routes
router.get('/admin/dashboard', isAdmin, renderDashboard)
router.get('/admin/form/login', csurfProtection, renderAdminForm)
router.get('/delete/:id', isAdmin, deleteProduct)
router.get('/logout', isAdmin, logout)
router.get('/deleteBroadcast', isAdmin, deleteBroadcast)

// Catalogo Routes
router.get('/catalogo/orientale', renderCatalogoOrientale)
router.get('/catalogo/occidentale', renderCatalogoOccidentale)
router.get('/catalogo/occidentale/:id', renderProductOccidentale)
router.get('/catalogo/orientale/:id', renderProductOrientale)
router.get('/catalogo', renderCatalogo)
router.get('/catalogo/occidentale/filtered/:id', renderFilterOccidentale)
router.get('/catalogo/orientale/filtered/:id', renderFilterOrientale)

// Error route
router.get('/error', errorController)


// Function for authenticate
function isAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/admin/form/login')
    }
}


// Exporting router for app.js
module.exports = router;