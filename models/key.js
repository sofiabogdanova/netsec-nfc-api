const mongoose = require('mongoose')

const keySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    app: {
        type: String,
        required: true,
        unique : true
    }
})

keySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Key', keySchema)