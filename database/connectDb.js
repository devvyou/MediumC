const { connect } = require('mongoose'),

    connDb = async () => {

        try {

            await connect(process.env.MONGO_URI)

        } catch (error) {
            throw new Error(error)
        }
    }

// Exporting connDb function to app.js
module.exports = connDb;
