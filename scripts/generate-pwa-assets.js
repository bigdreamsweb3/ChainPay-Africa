#!/usr/bin/env node

/**
 * This script generates PWA icons and splash screens
 * It requires the 'sharp' package:
 * npm install --save-dev sharp
 * 
 * Run it with: node scripts/generate-pwa-assets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp'; // You may need to install this: npm install --save-dev sharp

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base paths
const SOURCE_ICON = path.join(__dirname, '../public/logo.svg'); // Using SVG instead of PNG
const ICON_OUTPUT_DIR = path.join(__dirname, '../public/icons');
const SPLASH_OUTPUT_DIR = path.join(__dirname, '../public/splashscreens');

// Ensure output directories exist
if (!fs.existsSync(ICON_OUTPUT_DIR)) {
  fs.mkdirSync(ICON_OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(SPLASH_OUTPUT_DIR)) {
  fs.mkdirSync(SPLASH_OUTPUT_DIR, { recursive: true });
}

// Generate PWA icons
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  console.log('Generating PWA icons...');
  
  try {
    for (const size of iconSizes) {
      await sharp(SOURCE_ICON)
        .resize(size, size)
        .toFile(path.join(ICON_OUTPUT_DIR, `icon-${size}x${size}.png`));
      
      console.log(`Generated icon-${size}x${size}.png`);
    }
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

// Generate splash screens
const splashScreens = [
  // iPhone
  { width: 1290, height: 2796, name: 'apple-splash-dark-1290x2796.jpg', mode: 'dark' },
  { width: 1290, height: 2796, name: 'apple-splash-light-1290x2796.jpg', mode: 'light' },
  
  // iPad Pro 12.9"
  { width: 2048, height: 2732, name: 'apple-splash-dark-2048x2732.jpg', mode: 'dark' },
  { width: 2048, height: 2732, name: 'apple-splash-light-2048x2732.jpg', mode: 'light' },
  
  // iPad Pro 11"
  { width: 1668, height: 2388, name: 'apple-splash-dark-1668x2388.jpg', mode: 'dark' },
  { width: 1668, height: 2388, name: 'apple-splash-light-1668x2388.jpg', mode: 'light' },
];

async function generateSplashScreens() {
  console.log('Generating splash screens...');
  
  try {
    for (const screen of splashScreens) {
      const backgroundColor = screen.mode === 'dark' ? '#0A1025' : '#FFFFFF';
      const textColor = screen.mode === 'dark' ? '#FFFFFF' : '#0066FF';
      
      // Create a canvas with the background color
      const canvas = sharp({
        create: {
          width: screen.width,
          height: screen.height,
          channels: 3,
          background: backgroundColor
        }
      });
      
      // Resize the logo to a reasonable size for the splash screen (30% of smallest dimension)
      const logoSize = Math.min(screen.width, screen.height) * 0.3;
      const resizedLogo = await sharp(SOURCE_ICON)
        .resize(Math.round(logoSize), Math.round(logoSize))
        .toBuffer();
      
      // Center the logo on the canvas
      const logoX = Math.round((screen.width - logoSize) / 2);
      const logoY = Math.round((screen.height - logoSize) / 2);
      
      // Composite the logo on the canvas
      await canvas
        .composite([
          {
            input: resizedLogo,
            top: logoY,
            left: logoX
          }
        ])
        .toFile(path.join(SPLASH_OUTPUT_DIR, screen.name));
      
      console.log(`Generated ${screen.name}`);
    }
    console.log('All splash screens generated successfully!');
  } catch (error) {
    console.error('Error generating splash screens:', error);
  }
}

// Run the generation
(async () => {
  await generateIcons();
  await generateSplashScreens();
})(); 