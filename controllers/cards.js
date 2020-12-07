const cardRouter = require('express').Router()
const authHelper = require('../utils/authHelper')
const Card = require('../models/card')

cardRouter.post('/blacklist', async (request, response) => {
    const body = request.body

    const authenticated = await authHelper.auth(body)
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

    const authenticated = await authHelper.auth(body)
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

    const authenticated = await authHelper.auth(body)
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