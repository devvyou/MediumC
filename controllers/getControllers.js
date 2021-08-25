const Product = require("../database/models/Product"),
    ObjectId = require('mongoose').Types.ObjectId,
    Admin = require('../database/models/Admin');


const renderHome = async (req, res) => {

    try {
        const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

        return res.render('home', {
            layout: 'layouts/footerAos',
            broadcastMsg: admin.broadcast,
            title: 'MediumC | Landing Page'
        })
    } catch (err) {
        throw new Error(err)
    }

}


const renderDashboard = async (req, res) => {

    try {
        await Product.find({}, (err, data) => {

            if (err) throw new Error(err);

            return res.render('dashboard', {
                layout: 'layouts/noFollow',
                products: data,
                title: 'MediumC | Admin Dashboard'
            })

        })
    } catch (err) {
        throw new Error(err)
    }

}


const renderAdminForm = (req, res) => {

    return res.render('admin_form', {
        layout: 'layouts/noFollow',
        csurfToken: req.csrfToken(),
        title: 'MediumC | Admin Form'
    })

}


const renderCatalogoOrientale = async (req, res) => {
    try {

        // Find the Admin Document
        const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });


        // Check in the Admin Document the value of sortBt
        let order;
        if (admin.sortBy === 'prezzoCrescente') {
            order = 1;
        } else { order = -1 }


        // Find the Product with the value of variable order
        await Product.find({ type: 'Orientale' }).sort({ price: order }).exec((err, products) => {

            // Check if there is an error
            if (err) {
                throw new Error(err);
            }


            let array = [];


            // Loading 3 Products inside the array variable up to the products.length
            for (let i = 0; i < products.length; i = i + 3) {
                array.push(products.slice(i, i + 3));
            }


            return res.render('orientale', {
                layout: 'layouts/footerAos',
                products: array,
                broadcastMsg: admin.broadcast,
                title: 'MediumC | Catalogo Orientale'
            })

        })
    } catch (error) {
        throw new Error(error)
    }
}


const renderCatalogoOccidentale = async (req, res) => {

    try {

        const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

        let order;
        if (admin.sortBy === 'prezzoCrescente') {
            order = 1;
        } else { order = -1 }

        await Product.find({ type: 'Occidentale' }).sort({ price: order }).exec((err, products) => {
            let array = [];

            for (let i = 0; i < products.length; i = i + 3) {
                array.push(products.slice(i, i + 3));
            }

            return res.render('occidentale', {
                layout: 'layouts/footerAos',
                products: array,
                broadcastMsg: admin.broadcast,
                title: 'MediumC | Catalogo Occidentale'
            })
        })
    } catch (error) {
        throw new Error(error)
    }

}


const logout = (req, res) => {
    req.logOut();
    return res.redirect('/');
}


const renderProductOccidentale = async (req, res) => {
    try {

        // Check if the ID is valid
        await validID(req.params.id)

        const product = await Product.findOne({
            _id: req.params.id,
            type: 'Occidentale'
        });

        if (!product) {
            return res.redirect('/catalogo/occidentale')
        }

        return res.render('product', {
            layout: 'layouts/footerAos',
            product,
            title: 'MediumC | Catalogo Occidentale: ' + product.name
        })

    } catch (error) {
        throw new Error(error)
    }
}


const renderProductOrientale = async (req, res) => {
    try {

        // Check if the ID is valid
        await validID(req.params.id)

        const product = await Product.findOne({
            _id: req.params.id,
            type: 'Orientale'
        });

        if (!product) {
            return res.redirect('/catalogo/orientale')
        }

        return res.render('product', {
            layout: 'layouts/footerAos',
            product,
            title: 'MediumC | Catalogo Orientale: ' + product.name
        })


    } catch (error) {
        throw new Error(error)
    }
}

const deleteProduct = async (req, res) => {
    try {

        // Check if the ID is valid

        await validID(req.params.id);

        // Find and delete the Product
        await Product.findByIdAndDelete(req.params.id)
            .then(() => {
                return res.json({ msg: 'Ok' })
            }).catch(err => {
                throw new Error(err);
            })

    } catch (error) {
        throw new Error(error)
    }
}


const deleteBroadcast = async (req, res) => {
    try {
        await Admin.findOneAndUpdate({ email: process.env.ADMIN_EMAIL }, {
            broadcast: ''
        })
        return res.redirect('/admin/dashboard')
    } catch (error) {
        throw new Error(error)
    }
}

const errorController = (req, res) => {
    return res.render('404', {
        layout: 'layouts/withoutFooter'
    })
}

const renderCatalogo = (req, res) => {
    return res.render('catalogo', {
        layout: 'layouts/withoutFooterAos',
        title: 'MediumC | Catalogo'
    })
}

const renderFilterOccidentale = async (req, res) => {

    try {

        // Check if the ID is valid
        await validID(req.params.id)


        // Find the Admin doc
        const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

        // Find the Product and render a view with only the product found
        await Product.findOne({ _id: req.params.id, type: 'Occidentale' })
            .then(product => {
                return res.render(`ProductOneOccidentale`, {
                    layout: 'layouts/withoutFooterAos',
                    product: product,
                    broadcastMsg: admin.broadcast,
                    title: 'MediumC | Catalogo Occidentale'
                })
            })

    } catch (error) {
        throw new Error(error)
    }

}

const renderFilterOrientale = async (req, res) => {
    try {

        // Check if the ID is valid
        await validID(req.params.id)


        // Find the Admin doc
        const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });


        // Find the Product and render a view with only the product found
        Product.findOne({ _id: req.params.id, type: 'Orientale' })
            .then(product => {

                return res.render(`ProductOneOrientale`, {
                    layout: 'layouts/withoutFooterAos',
                    product: product,
                    broadcastMsg: admin.broadcast,
                    title: 'MediumC | Catalogo Orientale'
                })

            }).catch(err => {
                throw new Error(err)
            })

    } catch (error) {
        throw new Error(error)
    }

}


// Check if the ID is a valid Mongoose ID
function validID(id) {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid ID of the Product');
    } else {
        return true
    }
}


// Exportings all GET Controllers 
module.exports = {

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

}