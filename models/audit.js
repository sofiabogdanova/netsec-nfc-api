const mongoose = require('mongoose')

const auditSchema = new mongoose.Schema({
    card: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    action: {
        type: String,
        required: true
    }
})

auditSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Audit', auditSchema)