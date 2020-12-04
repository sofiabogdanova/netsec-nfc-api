const bcrypt = require('bcryptjs')
const cardRouter = require('express').Router()
const Card = require('../models/card')
const User = require('../models/user')

// cardRouter.post('/register', async (request, response) => {
//     const body = request.body
//     const password = body.password
//     if (!password) {
//         return response.status(400).json({
//             error: 'password is required'
//         })
//     }
//
//     const saltRounds = 10
//     const passwordHash = await bcrypt.hash(password, saltRounds)
//
//     const user = new User({
//         username: body.username,
//         passwordHash,
//     })
//
//     const savedUser = await user.save()
//
//     response.json(savedUser)
// })

cardRouter.post('/master')

cardRouter.post('/:id', async (request, response) => {
    const cardId = request.params.id
    const body = request.body

    const authenticated = await auth(body)
    if (!authenticated) {
        response.status(401).json({})
        return
    }

    const cards = await Card.find({card: cardId}, function (err, result) {
        if (err) {
            console.log(err);
        }
    })

    if (cards.length===0) {
        response.json({})
    } else {
        response.json(cards[0])
    }
})

cardRouter.post('/', async (request, response) => {
    const body = request.body

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


const deleteCardIfExists = async(cardId) => {
    const cards = await Card.find({card: cardId})
    if (cards.length===0) {
        return
    }
    const id = cards[0].id
    await Card.findByIdAndRemove(id)
}

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
module.exports = cardRouter