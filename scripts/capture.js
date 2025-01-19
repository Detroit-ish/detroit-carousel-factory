const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const SIZES = {
  carousel: { width: 1080, height: 1920 }  // Standard 9:16 mobile ratio
};

async function verifyImage(filePath) {
    const stats = await fs.stat(filePath);
    console.log(`Generated image at ${filePath}: ${stats.size} bytes`);
    if (stats.size < 1000) {
        throw new Error('Generated image seems too small - possible generation error');
    }
    return stats.size;
}

async function captureSlides({ template, data, format = 'carousel', outputPath }) {
    console.log('Capturing slide:', {format, outputPath, data});
    
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--allow-file-access-from-files']
    });

    try {
        const page = await browser.newPage();
        
        // Set viewport to mobile portrait
        await page.setViewport({
            width: SIZES.carousel.width,
            height: SIZES.carousel.height,
            deviceScaleFactor: 2
        });

        await page.goto(`file://${template}`);

        // Inject data and wait for it to be processed
        await page.evaluate((data) => {
            window.slideData = data;
            document.getElementById('title').textContent = data.title;
            document.getElementById('content').innerHTML = data.content;
            console.log('Data injected:', data);
        }, data);

        // Wait for content to be rendered
        await page.waitForTimeout(1000);

        // Take screenshot
        await page.screenshot({
            path: outputPath,
            type: 'png',
            clip: {
                x: 0,
                y: 0,
                width: SIZES.carousel.width,
                height: SIZES.carousel.height
            }
        });

        await verifyImage(outputPath);

    } catch (error) {
        console.error('Error during slide capture:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = { captureSlides, SIZES };