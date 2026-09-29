# Wooznam & The Lickers

The complete static website for Wooznam & The Lickers.

This repository contains the exact website published at:

https://wooznam-and-the-lickers-preview.wooznam.chatgpt.site

## What is included

- Complete single-page website
- Responsive mobile, tablet and desktop layouts
- Interactive spinning coin and band portraits
- Animated curtains, hero imagery and neon sign
- Seven embedded YouTube videos
- Film and Ashtray Sessions sections
- About and tour sections
- SoundCloud, TikTok, Instagram and YouTube links
- All required local image assets

## Publish with GitHub Pages

1. Create an empty GitHub repository.
2. Upload everything in this folder, preserving the `.github` folder.
3. Commit the files to the `main` branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, select **GitHub Actions**.

The included workflow will publish the site automatically after each push to `main`.

## Publish with Vercel

1. Import the GitHub repository into Vercel.
2. Leave the framework preset as **Other**.
3. Leave the build command empty.
4. Leave the output directory as `.`.
5. Deploy.

The included `vercel.json` supplies the required static-site configuration.

## Local preview

Run a local static server from the repository root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Structure

```text
.
├── .github/workflows/pages.yml
├── assets/
├── descent.css
├── descent.js
├── index.html
├── vercel.json
└── README.md
```

## Source snapshot

Packaged from the published site source at commit `8a061422ef5d4e16eede3e15a787a98de90f394d`.

