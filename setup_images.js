
const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\Shri Ganesh\\Desktop\\Vaidika-vangamaya\\image collection';
const destDir = 'c:\\Users\\Shri Ganesh\\Desktop\\Vaidika-vangamaya\\public\\images';

try {
    if (!fs.existsSync(destDir)) {
        console.log('Creating directory:', destDir);
        fs.mkdirSync(destDir, { recursive: true });
    }

    console.log('Copying Ramayana cover...');
    fs.copyFileSync(path.join(srcDir, 'ramayana cover.jpeg'), path.join(destDir, 'ramayana_cover.jpeg'));

    console.log('Copying Mahabharata cover...');
    fs.copyFileSync(path.join(srcDir, "mahabharata'.png"), path.join(destDir, 'mahabharata_cover.png'));

    console.log('Images setup complete');
} catch (error) {
    console.error('Error:', error);
}
