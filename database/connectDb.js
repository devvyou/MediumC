const mongoose = require('mongoose'),

    connDb = async () => {

        try {

            await mongoose.connect(process.env.MONGO_URI)

        } catch (error) {
            throw new Error(error)
        }
    }

// Exporting connDb function to app.js
module.exports = connDb;
