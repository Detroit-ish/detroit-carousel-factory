# Detroit Carousel Factory

Automated social media carousel generator with industrial-grade efficiency. Built for tech-savvy SMBs.

## Features
- Generate mobile-optimized carousel slides
- Brand-consistent styling
- Multiple social media formats support
- Automated PDF compilation
- High-quality PNG exports

## Supported Formats

### Mobile-First Social Formats
- `carousel`: LinkedIn carousel (9:16 ratio, 1080x1920px)
- `story`: Instagram/FB Stories (9:16 ratio, 1080x1920px)
- `reel`: Instagram/FB Reels cover (9:16 ratio, 1080x1920px)
- `feed`: Instagram optimal post (4:5 ratio, 1080x1350px)
- `square`: Standard square post (1:1 ratio, 1080x1080px)

## Quick Start

### Basic Usage
Generate a LinkedIn carousel:
```bash
node src/scripts/index.js
```

### Custom Command (Optional Setup)
Add to your package.json:
```json
{
  "scripts": {
    "linkedin": "node src/scripts/index.js",
    "story": "node src/scripts/index.js --format story",
    "reel": "node src/scripts/index.js --format reel",
    "feed": "node src/scripts/index.js --format feed",
    "square": "node src/scripts/index.js --format square"
  }
}
```

Then you can run:
```bash
npm run linkedin
npm run story
npm run reel
npm run feed
npm run square
```

### File Structure
```
slideShare/
├── src/
│   ├── scripts/
│   │   ├── index.js    # Main script
│   │   ├── capture.js  # Puppeteer capture logic
│   │   └── compile.js  # PDF compilation
│   ├── templates/
│   │   └── apollo-slide.html  # Slide template
│   └── styles/
└── dist/               # Generated files
    ├── slide_0.png
    ├── slide_1.png
    └── apollo_carousel.pdf
```

### Output
The script generates:
1. Individual PNG slides in the `dist` folder
2. Combined PDF in the `dist` folder

## Requirements
- Node.js
- NPM packages:
  ```bash
  npm install puppeteer pdfkit
  ```

## Tech Stack
- Node.js
- Puppeteer (for slide capture)
- PDFKit (for PDF compilation)

## Important Notes
- Images are automatically sized for mobile-first experience
- High DPI support (2x for retina displays)
- PDF is optimized for quality
- Supports HTML/CSS animations
- Full edge-to-edge design for modern social media