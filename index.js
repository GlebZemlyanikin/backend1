require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const chalk = require('chalk');
const path = require('path');
const {
    addNote,
    getNotes,
    removeNote,
    updateNote,
} = require('./notes.controller');
const { createUser, loginUser } = require('./users.controller');
const auth = require('./middlewares/auth');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'pages');

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/login', async (req, res) => {
    res.render('login', {
        title: 'Логин',
        error: undefined,
    });
});

app.post('/login', async (req, res) => {
    try {
        const token = await loginUser(req.body.email, req.body.password);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/');
    } catch (e) {
        res.status(400).render('login', {
            title: 'Логин',
            error: e.message,
        });
    }
});

app.get('/register', async (req, res) => {
    res.render('register', {
        title: 'Регистрация',
        error: undefined,
    });
});

app.post('/register', async (req, res) => {
    try {
        await createUser(req.body.email, req.body.password);

        res.redirect('/login');
    } catch (e) {
        let message = 'Не удалось создать аккаунт. Попробуйте позже.';
        if (e && e.code === 11000) {
            message = 'Пользователь с таким email уже существует.';
        } else if (e && e.name === 'ValidationError') {
            const firstError = Object.values(e.errors || {})[0];
            message = firstError?.message || 'Некорректные данные формы.';
        }
        res.status(400).render('register', {
            title: 'Регистрация',
            error: message,
        });
    }
});

app.get('/logout', async (req, res) => {
    res.cookie('token', '', { httpOnly: true });
    res.redirect('/login');
});

app.get('/', async (req, res) => {
    const token = req.cookies.token;
    let userEmail = null;

    try {
        const jwt = require('jsonwebtoken');
        const { JWT_SECRET } = require('./constants');
        const verified = jwt.verify(token, JWT_SECRET);
        userEmail = verified.email;
    } catch (e) {}

    res.render('index', {
        title: 'Главная страница',
        notes: await getNotes(),
        userEmail: userEmail,
        created: false,
        error: false,
    });
});

app.use(auth);

app.post('/', async (req, res) => {
    try {
        await addNote(req.body.title, res.user.email);
        res.render('index', {
            title: 'Главная страница',
            notes: await getNotes(),
            userEmail: res.user.email,
            created: true,
            error: false,
        });
    } catch (e) {
        res.render('index', {
            title: 'Главная страница',
            notes: await getNotes(),
            userEmail: res.user.email,
            created: false,
            error: e.message,
        });
    }
});

app.delete('/:id', async (req, res) => {
    try {
        await removeNote(req.params.id, res.user.email);
        res.render('index', {
            title: 'Главная страница',
            notes: await getNotes(),
            userEmail: res.user.email,
            created: false,
            error: false,
        });
    } catch (e) {
        res.render('index', {
            title: 'Главная страница',
            notes: await getNotes(),
            userEmail: res.user.email,
            created: false,
            error: e.message,
        });
    }
});

app.put('/:id', async (req, res) => {
    try {
        await updateNote(req.params.id, req.body.title, res.user.email);
        res.render('index', {
            title: 'Главная страница',
            notes: await getNotes(),
            userEmail: res.user.email,
            created: false,
            error: false,
        });
    } catch (e) {
        res.render('index', {
            title: 'Главная страница',
            notes: await getNotes(),
            userEmail: res.user.email,
            created: false,
            error: e.message,
        });
    }
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, () => {
        console.log(chalk.bgBlue(`Server is running on port ${port}`));
    });
});
