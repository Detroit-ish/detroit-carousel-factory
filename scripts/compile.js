const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { SIZES } = require('./capture');

async function verifyPDF(filePath) {
    const data = await fsPromises.readFile(filePath);
    console.log('PDF size:', data.length, 'bytes');
    
    if (!data.toString().startsWith('%PDF')) {
        throw new Error('Generated file is not a valid PDF');
    }
    
    return data.length;
}

async function compilePDF(images, outputPath, format = 'carousel', metadata = {}) {
    console.log('Starting PDF compilation...');
    console.log(`Processing ${images.length} images in ${format} format`);
    
    const size = SIZES[format] || SIZES.carousel;
    
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            autoFirstPage: false,
            bufferPages: true,
            size: [size.width, size.height],
            margin: 0
        });

        // Collect PDF data chunks
        const chunks = [];
        doc.on('data', chunk => chunks.push(chunk));

        // Set metadata
        doc.info['Title'] = metadata.title || 'LinkedIn Carousel';
        doc.info['Author'] = metadata.author || 'Detroit Carousel Factory';
        doc.info['Subject'] = metadata.subject || 'Social Media Content';
        doc.info['Keywords'] = metadata.keywords || 'linkedin,carousel,slides';

        try {
            // Add each image as a page
            images.forEach(imagePath => {
                doc.addPage();
                doc.image(imagePath, 0, 0, {
                    fit: [doc.page.width, doc.page.height],
                    align: 'center',
                    valign: 'center'
                });
            });

            // Finalize PDF
            doc.end();

            // When PDF is complete
            doc.on('end', async () => {
                const pdfData = Buffer.concat(chunks);
                
                try {
                    // Write synchronously to ensure complete write
                    fs.writeFileSync(outputPath, pdfData);
                    
                    // Verify the PDF
                    await verifyPDF(outputPath);
                    
                    console.log(`PDF successfully generated at: ${outputPath}`);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { compilePDF };