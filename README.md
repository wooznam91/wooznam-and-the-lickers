# Wooznam & The Lickers

The complete static website for Wooznam & The Lickers.

Production domain:

https://wooznam.com

## What is included

- Complete homepage plus five crawlable song pages
- Responsive mobile, tablet and desktop layouts
- Interactive spinning coin and band portraits
- High-resolution crossfading hero imagery, animated curtains and neon sign
- Seven embedded YouTube videos
- Film and Ashtray Sessions sections
- About and tour sections
- Spotify, SoundCloud, TikTok, Instagram and YouTube links, plus an Apple Music placeholder
- Canonical URLs, structured data, robots.txt and an XML sitemap
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
├── robots.txt
├── sitemap.xml
├── song.css
├── songs/
├── vercel.json
└── README.md
```

## Search indexing

After deploying, add `https://wooznam.com/sitemap.xml` in Google Search Console and request indexing for the homepage.
