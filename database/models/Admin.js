const mongoose = require('mongoose'),
    compare = require('bcrypt').compare,

    AdminSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
        },
        broadcast: {
            type: String,
            required: false
        },
        sortBy: {
            type: String,
            enum: ['prezzoCrescente', 'prezzoDecrescente'],
            default: 'prezzoCrescente'
        }
    });


AdminSchema.methods.validatePassword = async function (password) {
    try {
        return await compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
}


// Create the model of Admin
const Admin = mongoose.model('carpetAdmin', AdminSchema);


// Export Admin object 
module.exports = Admin;


// Create new Admin Function
async function newAdmin() {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        sortBy: 'decrescente'
    })
    await admin.save()
}


// Uncomment the line below to create a new Admin
// newAdmin()
