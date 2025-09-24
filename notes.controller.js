const chalk = require('chalk');
const Note = require('./models/Note');

async function addNote(title) {
    await Note.create({ title });
    console.log(chalk.bgGreen('Note added'));
}

async function getNotes() {
    const notes = await Note.find();
    return notes;
}

async function removeNote(id) {
    await Note.deleteOne({ _id: id });
    console.log(chalk.bgRed('Note removed'));
}

async function updateNote(id, title) {
    await Note.updateOne({ _id: id }, { title });
    console.log(chalk.bgYellow('Note updated'));
}

module.exports = {
    addNote,
    getNotes,
    removeNote,
    updateNote,
};
