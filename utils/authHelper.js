const User = require('../models/user')

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

module.exports = auth