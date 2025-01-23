const puppeteer = require('puppeteer');
const fs = require('fs').promises;

const SIZES = {
    carousel: { 
        width: 1080, 
        height: 1350,
        scale: 2
    }
};

async function captureSlides({ template, data, outputPath }) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--allow-file-access-from-files',
            `--window-size=${SIZES.carousel.width},${SIZES.carousel.height}`
        ]
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({
            width: SIZES.carousel.width,
            height: SIZES.carousel.height,
            deviceScaleFactor: SIZES.carousel.scale,
            isMobile: true,
            hasTouch: true,
            isLandscape: false
        });

        await page.goto(`file://${template}`, {
            waitUntil: 'networkidle0'
        });

        await page.evaluate((data) => {
            window.slideData = data;
            document.getElementById('title').textContent = data.title;
            document.getElementById('content').innerHTML = data.content;
        }, data);

        await page.waitForTimeout(1000);

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

    } catch (error) {
        console.error('Error capturing slide:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

module.exports = { captureSlides, SIZES };