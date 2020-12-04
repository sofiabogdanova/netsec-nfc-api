const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    card: {
        type: String,
        required: true,
        unique : true
    }
})

cardSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Card', cardSchema)