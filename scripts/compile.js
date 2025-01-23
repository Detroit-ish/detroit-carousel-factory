const PDFDocument = require('pdfkit');
const fs = require('fs');
const { SIZES } = require('./capture');

const POINTS_PER_PIXEL = 0.75;

async function compilePDF(images, outputPath) {
    const size = {
        width: SIZES.carousel.width * POINTS_PER_PIXEL,
        height: SIZES.carousel.height * POINTS_PER_PIXEL
    };

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            autoFirstPage: false,
            size: [size.width, size.height],
            margins: 0,
            layout: 'portrait'
        });

        const writeStream = fs.createWriteStream(outputPath);
        doc.pipe(writeStream);

        try {
            images.forEach(imagePath => {
                doc.addPage({
                    size: [size.width, size.height],
                    margin: 0
                }).image(imagePath, 0, 0, {
                    fit: [size.width, size.height],
                    align: 'center',
                    valign: 'center'
                });
            });

            doc.end();
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);

        } catch (error) {
            console.error('Error during PDF compilation:', error);
            reject(error);
        }
    });
}

module.exports = { compilePDF };