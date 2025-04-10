// This script creates the necessary directories and placeholder files for the chess pieces
// Run this with Node.js: node create-assets.js

const fs = require('fs');
const path = require('path');

// Create directories
const directories = [
    'assets',
    'assets/images',
    'assets/images/pieces',
    'css',
    'js'
];

// Create directories with error handling
directories.forEach(dir => {
    try {
        const dirPath = path.join(__dirname, dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created directory: ${dirPath}`);
        }
    } catch (error) {
        console.error(`Error creating directory ${dir}:`, error);
    }
});

// Create placeholder SVG files for chess pieces
const pieces = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
const colors = ['white', 'black'];

// Create SVG files with error handling
colors.forEach(color => {
    pieces.forEach(piece => {
        try {
            const fileName = `${color}-${piece}.svg`;
            const filePath = path.join(__dirname, 'assets', 'images', 'pieces', fileName);
            
            // Skip if file already exists
            if (fs.existsSync(filePath)) {
                console.log(`File already exists: ${fileName}`);
                return;
            }
            
            // Simple SVG placeholder with improved styling
            const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
                <circle cx="22.5" cy="22.5" r="20" fill="${color === 'white' ? '#fff' : '#000'}" stroke="#000" stroke-width="1.5"/>
                <text x="22.5" y="27.5" font-family="Arial" font-weight="bold" font-size="12" text-anchor="middle" fill="${color === 'white' ? '#000' : '#fff'}">${piece.charAt(0).toUpperCase()}</text>
            </svg>`;
            
            fs.writeFileSync(filePath, svgContent);
            console.log(`Created placeholder SVG: ${fileName}`);
        } catch (error) {
            console.error(`Error creating ${color} ${piece}:`, error);
        }
    });
});
