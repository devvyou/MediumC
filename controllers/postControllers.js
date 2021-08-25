// Requiring all the dependencies
const Product = require("../database/models/Product"),
    tinify = require('tinify'),
    passport = require("passport"),
    Admin = require("../database/models/Admin"),
    rimraf = require('rimraf');


// Set the API KEY to tinify dependency
tinify.key = process.env.TINIFY_API_KEY;



// Process: multer uploads the images in /Products and then tinify compress and upload them in /OptimizedImages. 
const addProductController = async (req, res) => {

    // Valid extensions of the images
    const extensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/jfif'];

    try {

        const file = req.file;

        // Check the extension of every file
        if (!extensions.includes(file.mimetype)) {
            return res.redirect('/admin/dashboard');
        }

        const { name, description, price, shape, place, type, material } = req.body;


        // Tinify compress the image from its original path '/Products
        const src = tinify.fromFile(`./public/Products/${file.filename}`);

        // Upload compressed image to /OptimizedImages
        await src.toFile(`./public/OptimizedImages/${file.filename}`);

        await new Promise((resolve, reject) => {

            // Delete uncompressed image
            rimraf(`./public/Products/${file.filename}`, err => {
                if (err) {
                    reject(err);
                }
                resolve();

            });

        });

        // Create and save the Product in the databse
        const product = new Product({
            name, price, shape, description, place, material, type,
            path: file.filename
        });
        await product.save();



        // Redirect to the Dashboard, like a reload page
        return res.redirect("/admin/dashboard");

    } catch (error) {
        throw new Error(error)
    }
}



const searchProduct = (req, res) => {

    let typeOfProduct;


    const { product, type } = req.body;


    // Check if the input is empty
    if (type === '' || product === '') return res.redirect('back');


    // Check if the hidden input is empty or modified
    switch (type) {
        case 'Occidentale':
            typeOfProduct = 'Occidentale';
            break;
        case 'Orientale':
            typeOfProduct = 'Orientale';
            break;
        default:
            return res.redirect('back');
    }


    Product.findOne({ name: product, type: typeOfProduct })
        .then(product => {

            if (!product) {
                return res.redirect('/catalogo/occidentale')
            }

            if (typeOfProduct === 'Occidentale') {
                return res.redirect(`/catalogo/occidentale/filtered/${product._id}`)
            }

            return res.redirect(`/catalogo/orientale/filtered/${product._id}`)

        }).catch(err => {
            throw new Error(err);
        })

}


const filterOrder = async (req, res) => {
    try {

        const value = req.body.value;

        if (value === 'prezzoCrescente' || value === 'prezzoDecrescente') {
            await Admin.findOneAndUpdate({ email: process.env.ADMIN_EMAIL }, {
                sortBy: value
            });

            return res.json({ msg: 'Ok' });

        } else { return res.json({ msg: 'No' }) }


    } catch (error) {
        throw new Error(error);
    }
}


const addBroadcast = async (req, res) => {

    const broadcast = req.body.broadcast;

    if (broadcast !== '') {
        await Admin.findOneAndUpdate({ email: process.env.ADMIN_EMAIL }, {
            broadcast
        })
    }

    return res.redirect('/admin/dashboard')

}


// Admin form
const loginController = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/form/login',
        failureFlash: false
    })(req, res, next)
}


// Exportings all POST Controllers 
module.exports = {

    addProductController,
    searchProduct,

    loginController,
    addBroadcast,
    filterOrder,

}