let st = Date.now();
let files = 0;

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const blooks = require('./blooks.json');

const imagesFolder = path.join(__dirname, 'output');
if (!fs.existsSync(imagesFolder)) fs.mkdirSync(imagesFolder);

Object.values(blooks).map(a => a.image).forEach(async (imageUrl) => {
    try {
        const response = await axios.get('https://blacket.org' + imageUrl, {
            responseType: 'arraybuffer'
        });
        const imageData = response.data;

        const filename = imageUrl.split('/').pop().toLowerCase();

        fs.writeFileSync(path.join(imagesFolder, filename), imageData, 'binary');
        files++;
        console.log(`Image ${filename} saved successfully.`);

        if (files === Object.keys(blooks).length) console.log(`Downloaded ${files} images in ${Date.now()-st}ms.`)
    } catch (error) {
        console.error(`Error saving image from ${imageUrl}:`, error);
    }
});