const { Router } = require('express'),
    router = Router(),
    multer = require('multer'),
    path = require('path');


// Multer Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Products/')
    },
    filename: (req, file, cb) => {
        const rN = Math.floor(Math.random() * 10);
        cb(null, rN + Date.now() + rN + path.extname(file.originalname));
    }
})


const upload = multer({ storage });


// Requiring POST Controllers
const {

    addProductController,
    searchProduct,

    loginController,
    addBroadcast,
    filterOrder,

} = require('../controllers/postControllers');


router.post('/addProduct', upload.single('avatar'), addProductController);
router.post('/login', loginController)
router.post('/filterOrder', filterOrder)
router.post('/addBroadcast', addBroadcast)
router.post('/searchProduct', searchProduct);


// Exporting router for app.js
module.exports = router;