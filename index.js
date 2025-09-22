const yargs = require('yargs');
const pkg = require('./package.json');
const { addNote, printNotes, removeNote } = require('./notes.controller');

yargs.version(pkg.version);

yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string',
        },
    },
    handler({ title }) {
        addNote(title);
    },
});

yargs.command({
    command: 'list',
    describe: 'List all notes',
    async handler() {
        printNotes();
    },
});

yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder: {
        id: {
            describe: 'Note id',
            demandOption: true,
            type: 'string',
        },
    },
    handler({ id }) {
        removeNote(id);
    },
});

yargs.parse();
