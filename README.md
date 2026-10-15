# R3D Marine website

This repository is arranged so the site can be maintained directly from GitHub without editing the main website code for normal content changes.

## Change a project image

1. Open `assets/models/<project>/`.
2. Upload or replace the image using the expected filename.
3. Commit the change.
4. Cloudflare will redeploy the website automatically.

For normal projects:

- `01.png` = main/front/card image
- `02.png` = gallery image 2
- `03.png` = gallery image 3
- `04.png` = gallery image 4

For the Universal Trim System, `01.png` is currently the only required image.

The website first looks for these local files. If one has not been uploaded yet, it automatically uses the older hosted image as a fallback.

## Change title, status, description, gallery order or Cults3D link

Edit:

`data/projects.js`

All project information is kept together in that one file.

## Change the R3D logo

Upload or replace:

`assets/brand/r3d-logo.png`

If that file is absent, the site uses the embedded fallback logo.

## Main project folders

- `assets/models/mercury-600/`
- `assets/models/mercury-400/`
- `assets/models/mercury-300/`
- `assets/models/rafnar-1200/`
- `assets/models/nimbus-c11/`
- `assets/models/axopar-45/`
- `assets/models/universal-trim/`

## Files you normally do not need to touch

- `index.html` — page structure
- `script.js` — gallery and site behaviour
- `styles.css` — visual design
- `media-brand.js` — fallback logo
- `wrangler.jsonc` — Cloudflare deployment configuration

For routine maintenance, you should normally only need the `assets/` folders and `data/projects.js`.
