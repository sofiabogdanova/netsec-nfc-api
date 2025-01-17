const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const cardsRouter = require('./controllers/cards')
const keysRouter = require('./controllers/keys')
const auditRouter = require('./controllers/audit')
const loginRouter = require('./controllers/login')
const readerRouter = require('./controllers/readers')
const middleware = require('./utils/middleware')
const tokenExtractor = require('./utils/tokenExtractor')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(tokenExtractor)

app.use('/api/cards', cardsRouter)
app.use('/api/keys', keysRouter)
app.use('/api/audit', auditRouter)
app.use('/api/login', loginRouter)
app.use('/api/readers', readerRouter)

if (process.env.NODE_ENV === 'test') {
}

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app