import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
!!!IMPORT: using "img-op.mjs"

npm i imagemin pngquant imagemin-jpegtran imagemin-pngquant@9.0.2
*/

const uploadsDir = path.join(__dirname, '../../../api/wp-content/uploads/2025');

async function compressImages(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            await compressImages(fullPath);
        } else if (['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())) {
            // const outputDir = path.join(dir, 'compressed'); 
            const outputDir = path.join(dir, ''); // you could set a folder 'compressed'
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            console.log('--> img path: ', fullPath);
            
            await imagemin([fullPath], {
                destination: outputDir,
                plugins: [
                    imageminJpegtran(),
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            });
            console.log(`Compressed: ${fullPath} → ${outputDir}`);
        }
    }
}

(async () => {
    console.log('Starting image compression...');
    await compressImages(uploadsDir);
    console.log('Image compression completed.');
})();