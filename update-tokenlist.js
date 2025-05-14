import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { isAddress } from "viem";

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
  let skipCount = 0;

  tokenlistData.tokens = tokenlistData.tokens.map((token) => {
    // Skip if address is not valid
    if (!token.address || !isAddress(token.address)) {
      console.log(`Skipping token ${token.name || "unknown"}: Invalid address`);
      skipCount++;
      return token;
    }

    if (token.logoURI) {
      // Get lowercase address
      const lowercaseAddress = token.address.toLowerCase();

      // Check if the path contains token-logo and is not already pointing to token-logo-optimized
      if (
        token.logoURI.includes("token-logo") &&
        !token.logoURI.includes("token-logo-optimized")
      ) {
        // Create the new path with lowercase address
        const baseUrl =
          "https://raw.githubusercontent.com/pulsecoin-io/Midgard-tokenlist/main/token-logo-optimized/";
        token.logoURI = `${baseUrl}${lowercaseAddress}.webp`;
        updatedCount++;
      }
      // Check if we need to convert the address to lowercase in existing optimized URLs
      else if (token.logoURI.includes("token-logo-optimized")) {
        // Extract the current address from the URL
        const urlParts = token.logoURI.split("/");
        const filenameWithExt = urlParts[urlParts.length - 1];
        const filename = filenameWithExt.split(".")[0];

        // If the filename is not already lowercase, update it
        if (filename !== lowercaseAddress) {
          const baseUrl =
            "https://raw.githubusercontent.com/pulsecoin-io/Midgard-tokenlist/main/token-logo-optimized/";
          token.logoURI = `${baseUrl}${lowercaseAddress}.webp`;
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
- Skipped tokens: ${skipCount}
- Original tokenlist updated: ${tokenlistPath}
- Backup saved to: ${backupPath}
`);
} catch (error) {
  console.error("Error updating tokenlist:", error.message);
  process.exit(1);
}
