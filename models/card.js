const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    card: {
        type: String,
        required: true,
        unique : true
    },
    compromised: {
        type: Boolean,
        default: false
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