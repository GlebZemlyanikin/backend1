const chalk = require('chalk');
const Note = require('./models/Note');

async function addNote(title, owner) {
    await Note.create({ title, owner });
    console.log(chalk.bgGreen('Заметка добавлена'));
}

async function getNotes() {
    const notes = await Note.find();
    return notes;
}

async function removeNote(id, owner) {
    const result = await Note.deleteOne({ _id: id, owner });
    if (result.deletedCount === 0) {
        throw new Error('Заметка не найдена');
    }
    console.log(chalk.bgRed('Заметка удалена'));
}

async function updateNote(id, title, owner) {
    const result = await Note.updateOne({ _id: id, owner }, { title });
    if (result.matchedCount === 0) {
        throw new Error('Заметка не найдена');
    }
    console.log(chalk.bgYellow('Заметка обновлена'));
}

module.exports = {
    addNote,
    getNotes,
    removeNote,
    updateNote,
};
