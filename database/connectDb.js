const mongoose = require('mongoose'),

    connDb = async () => {

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }

        try {

            await mongoose.connect(process.env.MONGO_URI, options, () => {
                console.log('Tappetaio: Server on')
            })

        } catch (error) {
            throw new Error(error)
        }
    }

// Exporting connDb function to app.js
module.exports = connDb;