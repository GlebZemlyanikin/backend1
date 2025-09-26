const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('./constants');

async function loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Неверный пароль');
    }

    return jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
}

async function createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 5);
    await User.create({ email, password: hashedPassword });
}

module.exports = { createUser, loginUser };
