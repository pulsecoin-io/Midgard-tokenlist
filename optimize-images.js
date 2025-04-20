import { readdirSync, mkdirSync, existsSync } from "fs";
import { join, parse } from "path";
import sharp from "sharp";

const sourceDir = "./token-logo";
const outputDir = "./token-logo-optimized";

// Create output directory if it doesn't exist
if (!existsSync(outputDir)) {
  mkdirSync(outputDir);
}

// Get all PNG files from source directory
const imageFiles = readdirSync(sourceDir).filter((file) =>
  file.toLowerCase().endsWith(".png")
);

console.log(`Found ${imageFiles.length} PNG images to optimize.`);

// Process each image
const processImages = async () => {
  let successCount = 0;
  let errorCount = 0;

  for (const file of imageFiles) {
    const sourcePath = join(sourceDir, file);
    const { name } = parse(file);
    const outputPath = join(outputDir, `${name}.webp`);

    try {
      await sharp(sourcePath)
        .resize(48, 48)
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
Optimization complete:
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
