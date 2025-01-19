const { captureSlides } = require('./capture');
const { compilePDF } = require('./compile');
const path = require('path');
const fs = require('fs').promises;

const mockData = [
  {
    title: "Apollo.io's Game-Changing Update",
    content: "Waterfall Enrichment Beta now pulls from 5 data providers in real-time"
  },
  {
    title: "What SMBs Are Missing",
    content: "Access to: Bombora intent data, LeadSift insights, Premium enrichment, Enterprise dialers, and more..."
  },
  {
    title: "The Real Value",
    content: "All enterprise features bundled into ONE platform with pay-per-use enrichment"
  },
  {
    title: "Take Action Now",
    content: "Stop burning cash on multiple subscriptions. Get enterprise-grade tools at SMB pricing."
  }
];

async function generateCarousel() {
  try {
    const template = path.join(__dirname, '..', 'templates', 'apollo-slide.html');
    const images = [];
    const distDir = path.join(__dirname, '..', '..', 'dist');
    
    console.log('Template path:', template);
    console.log('Dist directory:', distDir);

    await fs.mkdir(distDir, { recursive: true });

    for (let i = 0; i < mockData.length; i++) {
      const outputPath = path.join(distDir, `slide_${i}.png`);
      console.log(`Generating slide ${i} at: ${outputPath}`);
      
      await captureSlides({
        template,
        data: mockData[i],
        outputPath
      });
      images.push(outputPath);
    }

    const pdfPath = path.join(distDir, 'apollo_carousel.pdf');
    console.log('Creating PDF at:', pdfPath);
    await compilePDF(images, pdfPath);
    
    console.log('Generation complete!');
  } catch (error) {
    console.error('Error:', error);
  }
}

generateCarousel();