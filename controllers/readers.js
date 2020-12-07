const readerRouter = require('express').Router()
const User = require('../models/user')

readerRouter.post('/compromise', async (request, response) => {
    const body = request.body

    const user = await User.findOne({username: body.username})

    if (!user) {
        response.status(404)
        return
    }

    user.compromised = true
    const savedUser = await user.save()

    response.json(savedUser)
})

module.exports = readerRouter