# Shashank Agarwal - Architecture Portfolio 2026

Static portfolio site with generated `portfolio.json` and `portfolio.pdf`.

## Structure

```
.
|-- src/
|   |-- index.html
|   |-- styles/style.css
|   `-- scripts/script.js
|-- assets/
|   |-- images/
|   |   |-- branding/
|   |   `-- profile/
|   `-- projects/
|       `-- project*/(img, download)
|-- data/
|   `-- project-metadata.json
|-- scripts/
|   `-- generate-projects.js
|-- docs/
|   `-- README.md
|-- public/
|   |-- portfolio.json
|   `-- portfolio.pdf
|-- index.html
`-- update.bat
```

## Development

- Entry page: `src/index.html` (root `index.html` redirects here).
- Regenerate data + PDF: `node scripts/generate-projects.js`.
- Metadata source: `data/project-metadata.json`.

## Notes

- `assets/projects/` is the single source of project media.
- Generated outputs are in `public/`.
