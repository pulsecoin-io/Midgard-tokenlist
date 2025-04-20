import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const tokenlistPath = "./midgard-tokenlist.json";
// Remove output path since we'll update the original file
// const outputPath = "./midgard-tokenlist-updated.json";

// Create backup of original file
const backupPath = "./midgard-tokenlist.backup.json";

// Check if the tokenlist file exists
if (!existsSync(tokenlistPath)) {
  console.error(`Error: Tokenlist file not found at ${tokenlistPath}`);
  process.exit(1);
}

// Read the tokenlist JSON
try {
  // Create backup before making changes
  const originalData = readFileSync(tokenlistPath, "utf8");
  writeFileSync(backupPath, originalData, "utf8");
  console.log(`Backup created at ${backupPath}`);

  const tokenlistData = JSON.parse(originalData);

  console.log(`Found tokenlist with ${tokenlistData.tokens.length} tokens`);

  // Update the logo URLs to point to WebP files in token-logo-optimized folder
  let updatedCount = 0;

  tokenlistData.tokens = tokenlistData.tokens.map((token) => {
    if (token.logoURI) {
      // Check if the path contains token-logo and is not already pointing to token-logo-optimized
      if (
        token.logoURI.includes("token-logo") &&
        !token.logoURI.includes("token-logo-optimized")
      ) {
        // Get the original path parts
        const pathParts = token.logoURI.split("/");

        // Find the token-logo part in the path and replace it with token-logo-optimized
        const tokenLogoIndex = pathParts.findIndex(
          (part) => part === "token-logo" || part.endsWith("/token-logo")
        );

        if (tokenLogoIndex >= 0) {
          pathParts[tokenLogoIndex] = pathParts[tokenLogoIndex].replace(
            "token-logo",
            "token-logo-optimized"
          );

          // Rebuild the path, keeping the current extension (webp or png)
          const newPath = pathParts.join("/");

          // If still png, convert to webp
          token.logoURI = newPath.replace(/\.png$/i, ".webp");

          updatedCount++;
        }
      }
    }
    return token;
  });

  // Write the updated tokenlist back to the original file
  writeFileSync(tokenlistPath, JSON.stringify(tokenlistData, null, 2), "utf8");

  console.log(`
Update complete:
- Total tokens: ${tokenlistData.tokens.length}
- Updated logo URLs: ${updatedCount}
- Original tokenlist updated: ${tokenlistPath}
- Backup saved to: ${backupPath}
`);
} catch (error) {
  console.error("Error updating tokenlist:", error.message);
  process.exit(1);
}
