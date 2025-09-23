const express = require('express');
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
    });
});
app.post('/', async (req, res) => {
    await addNote(req.body.title);
    res.redirect('/?created=1');
});
app.delete('/:id', async (req, res) => {
    await removeNote(req.params.id);
    res.status(200).json({ ok: true });
});

app.put('/:id', async (req, res) => {
    await updateNote(req.params.id, req.body.title);
    res.status(200).json({ ok: true });
});

app.listen(port, () => {
    console.log(chalk.bgBlue(`Server is running on port ${port}`));
});
