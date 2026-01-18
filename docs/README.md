# Lenny's Podcast Transcripts - GitHub Pages Website

This directory contains a static website for browsing and searching Lenny's Podcast transcripts.

## Features

- **Browse all 303 episodes** with rich metadata
- **Full-text search** across guests, titles, descriptions, and keywords
- **Filter by topics** (87 topic categories)
- **Sort options**: by date, guest name, views, or duration
- **Episode detail view** with full transcripts
- **YouTube integration** with direct links to videos
- **Responsive design** for mobile and desktop

## Structure

```
docs/
├── index.html           # Main HTML page
├── styles.css          # Styles and responsive design
├── app.js              # JavaScript application logic
├── .nojekyll           # Disables Jekyll processing on GitHub Pages
├── data/
│   ├── episodes.json        # Full episode data with transcripts (25MB)
│   ├── episodes-index.json  # Lightweight index without transcripts (450KB)
│   └── topics.json          # Topic index with episode mappings
└── README.md           # This file
```

## Development

### Regenerating Data Files

After adding or updating transcripts, regenerate the data files:

```bash
python3 scripts/build-data.py
```

This creates:
- `docs/data/episodes.json` - Complete episode data including full transcripts
- `docs/data/episodes-index.json` - Lightweight metadata for initial page load
- `docs/data/topics.json` - Topic categories and episode associations

### Local Testing

To test the website locally, run a simple HTTP server:

```bash
cd docs
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## GitHub Pages Deployment

### Option 1: Enable GitHub Pages from the repository settings

1. Go to your repository settings
2. Navigate to "Pages" in the sidebar
3. Under "Source", select "Deploy from a branch"
4. Select branch: `main` (or your default branch)
5. Select folder: `/docs`
6. Click "Save"

Your site will be available at: `https://<username>.github.io/<repository-name>/`

### Option 2: Keep the repository private

GitHub Pages works with private repositories if you have:
- GitHub Pro (personal accounts)
- GitHub Team or Enterprise

The site will only be accessible to those with repository access.

## Technology Stack

- **Pure HTML/CSS/JavaScript** - No build tools or frameworks required
- **Client-side rendering** - All filtering and search happens in the browser
- **Lazy loading** - Full transcripts are only loaded when viewing episode details
- **Progressive enhancement** - Works without JavaScript for basic content access

## Performance

- Initial page load: ~450KB (index data)
- Full episode data: 25MB (loaded on-demand)
- No external dependencies
- Optimized for fast browsing and searching

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
