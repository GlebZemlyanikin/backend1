const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');

const DB_PATH = path.join(__dirname, 'db.json');

async function addNote(title) {
    const notes = await getNotes();
    const note = {
        title,
        id: Date.now().toString(),
    };

    notes.push(note);

    await fs.writeFile(DB_PATH, JSON.stringify(notes));
    console.log(chalk.bgGreen('Note added'));
}

async function getNotes() {
    const notes = await fs.readFile(DB_PATH, { encoding: 'utf-8' });
    return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function printNotes() {
    const notes = await getNotes();
    console.log(chalk.bgBlue('Notes:'));
    notes.forEach((note) => {
        console.log(chalk.bgGreen(note.id), chalk.blue(note.title));
    });
}
async function removeNote(id) {
    const notes = await getNotes();
    const filteredNodes = notes.filter((note) => note.id !== id);
    await fs.writeFile(DB_PATH, JSON.stringify(filteredNodes));
    console.log(chalk.bgRed('Note removed'));
}

async function updateNote(id, title) {
    const notes = await getNotes();
    const note = notes.find((note) => note.id === id);
    note.title = title;
    await fs.writeFile(DB_PATH, JSON.stringify(notes));
    console.log(chalk.bgYellow('Note updated'));
}

module.exports = {
    addNote,
    printNotes,
    removeNote,
    getNotes,
    updateNote,
};
