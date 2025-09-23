const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');

const base = path.join(__dirname, 'temp');

const getContent = () => `
\n\r${process.argv[2] ?? ''}
`;

async function makeDir() {
    try {
        if (fsSync.existsSync(base)) {
            await fs.appendFile(path.join(base, 'text.txt'), getContent());
            const data = await fs.readFile(
                path.join(base, 'text.txt'),
                'utf-8'
            );
            console.log(data);
        } else {
            await fs.mkdir(base);
            console.log('Directory created');
            await fs.writeFile(path.join(base, 'text.txt'), getContent());
        }
    } catch (err) {
        console.log(err);
    }
}

makeDir();
