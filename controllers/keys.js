const bcrypt = require('bcryptjs')
const keyRouter = require('express').Router()
const auth = require('../utils/authHelper')

cardRouter.post('/:app', async (request, response) => {
    const body = request.body
    const app = request.params.app

    const authenticated = await auth(body)
    if (!authenticated) {
        response.status(401).json({})
        return
    }

    await deleteCardIfExists(body.card)

    const card = new Card(body)
    await card.save()

    response.status(201).json(card)
})

const auth = async(body) => {
    const username = body.username;
    const pswd = body.password;

    //const user = await User.findOne({ username: username });
    const users = await User.find({ username: username })
    if (users.length===0) {
        return false
    }

    const user = users[0]
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(pswd, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return false
    }
    return true
}

