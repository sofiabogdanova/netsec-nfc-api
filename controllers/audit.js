const auditRouter = require('express').Router()
const authHelper = require('../utils/authHelper')
const Audit = require('../models/audit')

auditRouter.get('/:id', async (request, response) => {
    const cardId = request.params.id

    const audits = await Audit.find({card: cardId}, function (err, result) {
        if (err) {
            console.log(err);
        }
    })

    if (audits.length===0) {
        response.json({})
    } else {
        response.json(audits)
    }
})

auditRouter.post('/', async (request, response) => {
    const body = request.body

    const authenticated = await authHelper.auth(body)
    if (!authenticated) {
        response.status(401).json({})
        return
    }

    const audit = new Audit(body)
    await audit.save()

    response.status(201).json(audit)
})

module.exports = auditRouter