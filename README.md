# Wooznam & The Lickers — v26 migration rebuild

Reconstructed static version of the current ChatGPT Site projection (source version 26) for GitHub/Vercel migration.

## Architecture

- GitHub: canonical website source and version history
- Vercel: deployment from `main`
- Google Drive: master asset/archive store
- ChatGPT Library: working area only, not source of truth

## Deployment

Import the repository into Vercel using Framework Preset **Other**. No build command or output directory is required.

## Important

This rebuild replaces the obsolete September 22 Vercel ZIP. Do not restore `wooznam-and-the-lickers-vercel.zip` over this version.
