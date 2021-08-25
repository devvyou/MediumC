const mongoose = require('mongoose'),
    ProductSchema = new mongoose.Schema({
        type: {
            enum: ['Orientale', 'Occidentale'],
            type: String,
            required: true,
        },
        shape: {
            enum: ['quadrata', 'rotonda'],
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        place: {
            type: String,
            required: true
        },
        material: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        path: {
            type: String
        }
    })


// Export Product object 
const Product = mongoose.model('carpet', ProductSchema);


// Export Admin object 
module.exports = Product;