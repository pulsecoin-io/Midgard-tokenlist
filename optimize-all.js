import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function runOptimization() {
  console.log("=== Starting Image Optimization Process ===");

  try {
    // Step 1: Run the image optimization script
    console.log("\n🖼️  Step 1: Optimizing images...");
    const { stdout: optimizeOutput, stderr: optimizeError } = await execAsync(
      "bun run optimize-images.js"
    );

    if (optimizeError) {
      console.error("Error during image optimization:", optimizeError);
      process.exit(1);
    }

    console.log(optimizeOutput);

    // Step 2: Run the tokenlist update script
    console.log("\n📝 Step 2: Updating tokenlist...");
    const { stdout: updateOutput, stderr: updateError } = await execAsync(
      "bun run update-tokenlist.js"
    );

    if (updateError) {
      console.error("Error during tokenlist update:", updateError);
      process.exit(1);
    }

    console.log(updateOutput);

    console.log("\n✅ All tasks completed successfully!");
    console.log(`
Next steps:
1. Review the optimized images in the 'token-logo-optimized' directory
2. The tokenlist now points to the 'token-logo-optimized' directory for WebP images

Note: 
- A backup of the original tokenlist was created at 'midgard-tokenlist.backup.json'
- If you decide to move the optimized images back to the main token-logo directory, 
  you'll need to update the paths in the tokenlist again.
`);
  } catch (error) {
    console.error("Process failed:", error.message);
    process.exit(1);
  }
}

runOptimization();
