# Midgard Tokenlist

## Image Optimization

This repository includes scripts to optimize token logo images to WebP format at 48x48 resolution and update the tokenlist accordingly.

### Requirements

- [Bun](https://bun.sh/) installed
- Dependencies installed (`bun install`)

### Running the Optimization Scripts

#### Option 1: All-in-One Script (Recommended)

```bash
bun run optimize-all.js
```

This script will:

- Optimize all PNG images to 48x48 WebP
- Update the original tokenlist JSON to reference WebP images
- Point tokenlist logoURIs to the token-logo-optimized directory
- Create a backup of the original tokenlist file
- Guide you through the next steps

#### Option 2: Individual Scripts

If you prefer to run the steps separately:

**Step 1: Optimize Images**

```bash
bun run optimize-images.js
```

This will:

- Read all PNG images from the `token-logo` directory
- Convert them to 48x48 WebP format with 90% quality
- Save the optimized images to `token-logo-optimized` directory

**Step 2: Update Tokenlist JSON**

```bash
bun run update-tokenlist.js
```

This will:

- Create a backup of the original tokenlist at `midgard-tokenlist.backup.json`
- Read the existing `midgard-tokenlist.json` file
- Update all `.png` references to `.webp` in the `logoURI` fields
- Change paths to point to the `token-logo-optimized` directory
- Save changes directly to the original tokenlist file

### Final Steps

After running the scripts:

1. Review the optimized images in the `token-logo-optimized` directory
2. The tokenlist will now be pointing to the optimized WebP images

### Safety Measures

A backup of the original tokenlist is automatically created at `midgard-tokenlist.backup.json` before any changes are made.

### Updating the Tokenlist

After optimizing images, you may need to update the tokenlist JSON to reference the new WebP images.
