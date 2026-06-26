# FutureWork Systems Static Site Rebuild

This repository branch contains an initial static HTML/CSS/JS rebuild package based on public content captured from `futureworksystems.com` under the domain restriction in `conversion-instructions-fws-site-v1.md`.

## What was rebuilt

- Static site shell using plain HTML, CSS, and vanilla JavaScript.
- Main information architecture for Home, BI Solutions, Board Matters, WIOA Impact Report, Company, Connect, and Privacy.
- Extracted and normalized content from the strongest public standalone pages:
  - `/Portals/0/FWSBI-Tiers.html`
  - `/Portals/0/Send-My-Impact-Report-FWS-Site-v1.htm`
  - `/BI-Solutions/Board-Matters`
  - `/Company/Clients`
- Placeholder forms marked with `data-integration-required="true"` where DNN or external backend behavior must be replaced.

## What remains incomplete

- Binary assets and screenshots were not committed in this pass.
- Several DNN shell pages exposed only navigation/footer text through public parsing. They need browser-rendered capture or DNN export.
- Privacy, About, Careers, and some product child pages need owner review if DNN module content exists but did not expose cleanly.
- Form endpoints need an approved static-site form handler.

## How to view locally

Open `static-site/index.html` in a browser or serve the folder with any static HTTP server.

Example:

```bash
cd static-site
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Domain restriction

The capture process must remain within `futureworksystems.com`. External URLs should be inventoried but not crawled or downloaded without approval.
