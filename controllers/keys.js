const bcrypt = require('bcryptjs')
const keyRouter = require('express').Router()
const auth = require('../utils/authHelper')
const Key = require('../models/key')

keyRouter.post('/:app', async (request, response) => {
    const body = request.body
    const app = request.params.app

    const authenticated = await auth(body)
    if (!authenticated) {
        response.status(401).json({})
        return
    }

    const keys = await Key.find({app: app})
    if (keys.length===0) {
        return
    }

    const masterKey = keys[0]
    response.status(201).json(masterKey)
})

keyRouter.post('/', async (request, response) => {
    const body = request.body

    const authenticated = await auth(body)
    if (!authenticated) {
        response.status(401).json({})
        return
    }

    await deleteKeyIfExists(body.app)

    const key = new Key(body)
    await key.save()

    response.status(201).json(card)
})

const deleteKeyIfExists = async(app) => {
    const keys = await Key.find({app: app})
    if (keys.length===0) {
        return
    }
    const id = keys[0].id
    await Key.findByIdAndRemove(id)
}

module.exports = keyRouter

