import { readdirSync, mkdirSync, existsSync } from "fs";
import { join, parse } from "path";
import sharp from "sharp";
import { isAddress } from "viem";

const sourceDir = "./token-logo";
const outputDir = "./token-logo-optimized";

// Create output directory if it doesn't exist
if (!existsSync(outputDir)) {
  mkdirSync(outputDir);
}

// Supported image formats
const supportedFormats = [
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
  ".tiff",
  ".tif",
];

// Get all image files from source directory
const imageFiles = readdirSync(sourceDir).filter((file) => {
  const extension = file.toLowerCase().substring(file.lastIndexOf("."));
  const name = parse(file).name;

  // Check if file has a supported extension and is a valid Ethereum address
  return supportedFormats.includes(extension) && isAddress(name);
});

console.log(`Found ${imageFiles.length} valid address images to optimize.`);

// Process each image
const processImages = async () => {
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const file of imageFiles) {
    const sourcePath = join(sourceDir, file);
    const { name } = parse(file);

    // Convert name to lowercase
    const lowercaseName = name.toLowerCase();
    const outputPath = join(outputDir, `${lowercaseName}.webp`);

    try {
      await sharp(sourcePath)
        .resize(80, 80)
        .webp({ quality: 90 })
        .toFile(outputPath);

      successCount++;
      if (successCount % 10 === 0) {
        console.log(`Processed ${successCount} images...`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
      errorCount++;
    }
  }

  console.log(`
Image optimization complete:
- Total images: ${imageFiles.length}
- Successfully optimized: ${successCount}
- Failed: ${errorCount}
- Output directory: ${outputDir}
`);
};

processImages().catch((error) => {
  console.error("An error occurred during image processing:", error);
  process.exit(1);
});
