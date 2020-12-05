const cardRouter = require('express').Router()
const auth = require('../utils/authHelper')
const Card = require('../models/card')

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
cardRouter.post('/blacklist', async (request, response) => {
    const body = request.body

    const authenticated = await auth(body)
    if (!authenticated) {
        response.status(401).json({})
        return
    }

    const cards = await Card.find({compromised: true}, function (err, result) {
        if (err) {
            console.log(err);
        }
    })

     const result = {
        cards: []
     }

    if (cards.length===0) {
        response.json(result)
    } else {
        result.cards = cards
        response.json(result)
    }
})

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

module.exports = cardRouter