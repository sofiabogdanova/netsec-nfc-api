const jwt = require('jsonwebtoken')

const auth = async(body) => {
    const token = body.token
    const decodedToken = decodeToken(token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return false
    }
    return true
}

const getUsernameFromToken = async(body) => {
    const token = body.token
    const decodedToken = decodeToken(token, process.env.SECRET)
    return decodedToken.username
}


const decodeToken = (token, secret) =>  jwt.verify(token, secret)

module.exports = {
    auth,
    getUsernameFromToken
}