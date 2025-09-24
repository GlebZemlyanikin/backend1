const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const path = require('path');
const {
    addNote,
    getNotes,
    removeNote,
    updateNote,
} = require('./notes.controller');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'pages');

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', async (req, res) => {
    res.render('index', {
        title: 'Главная страница',
        notes: await getNotes(),
        created: Boolean(req.query.created),
        error: Boolean(req.query.error),
    });
});

app.post('/', async (req, res) => {
    try {
        await addNote(req.body.title);
        res.redirect('/?created=1');
    } catch (e) {
        console.log(e);
        res.render('index', {
            title: 'Главная страница',
            notes: await getNotes(),
            created: false,
            error: true,
        });
    }
});

app.delete('/:id', async (req, res) => {
    await removeNote(req.params.id);
    res.render('index', {
        title: 'Главная страница',
        notes: await getNotes(),
        created: false,
        error: false,
    });
});

app.put('/:id', async (req, res) => {
    await updateNote(req.params.id, req.body.title);
    res.render('index', {
        title: 'Главная страница',
        notes: await getNotes(),
        created: false,
        error: false,
    });
});

mongoose
    .connect(
        'mongodb+srv://zemlyaniking2_db_user:MvpIz2yvoajkqSRv@cluster0.zrhvttn.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(() => {
        app.listen(port, () => {
            console.log(chalk.bgBlue(`Server is running on port ${port}`));
        });
    });
