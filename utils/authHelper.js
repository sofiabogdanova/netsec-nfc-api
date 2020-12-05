const jwt = require('jsonwebtoken')

const auth = async(body) => {
    const token = body.token
    const decodedToken = decodeToken(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return false
    }
    return true
}

const decodeToken = (token, secret) =>  jwt.verify(token, secret)

module.exports = auth