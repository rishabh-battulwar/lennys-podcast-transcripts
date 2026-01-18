# Lenny's Podcast Transcripts Archive

A comprehensive archive of transcripts from [Lenny's Podcast](https://www.youtube.com/@LennysPodcast), organized for easy use with AI coding assistants and language models.

## About Lenny's Podcast

Lenny's Podcast features interviews with world-class product leaders and growth experts, providing concrete, actionable, and tactical advice to help you build, launch, and grow your own product.

## Quick Start

**🌐 Browse the website:** Visit the [GitHub Pages website](docs/) for a modern, searchable interface to explore all 303 episodes.

**Browse by topic:** Start with [index/README.md](index/README.md) to explore episodes by topic.

**Search transcripts:**
```bash
grep -r "product-market fit" episodes/
```

## Repository Structure

```
├── episodes/                    # 303 episode transcripts
│   └── {guest-name}/
│       └── transcript.md
├── index/                       # AI-generated topic index
│   ├── README.md                # Main entry point
│   ├── product-management.md    # Episodes about product management
│   ├── leadership.md            # Episodes about leadership
│   └── ...                      # 87 topic files
├── docs/                        # GitHub Pages website
│   ├── index.html               # Main website page
│   ├── app.js                   # Interactive browser application
│   ├── styles.css               # Responsive styling
│   └── data/                    # JSON data files
│       ├── episodes-index.json  # Episode metadata (450KB)
│       ├── episodes.json        # Full transcripts (25MB)
│       └── topics.json          # Topic categories
└── scripts/
    ├── build-index.sh           # Regenerate topic index
    └── build-data.py            # Generate website data files
```

## Episode Format

Each episode has its own folder named after the guest(s), containing a `transcript.md` file with:

1. **YAML Frontmatter** - Structured metadata including:
   - `guest`: Name of the guest(s)
   - `title`: Full episode title
   - `youtube_url`: Link to the YouTube video
   - `video_id`: YouTube video ID
   - `publish_date`: Publication date (YYYY-MM-DD)
   - `description`: Episode description
   - `duration_seconds`: Episode length in seconds
   - `duration`: Human-readable duration
   - `view_count`: Number of views at time of archival
   - `channel`: Channel name

2. **Transcript Content** - Full text transcript of the episode

## Topic Index

The `index/` folder contains AI-generated keyword tags for each episode, organized by topic:

| Topic | Description |
|-------|-------------|
| [Product Management](index/product-management.md) | 57+ episodes on PM skills and practices |
| [Leadership](index/leadership.md) | Episodes on management and leadership |
| [Growth Strategy](index/growth-strategy.md) | Growth tactics and frameworks |
| [Product-Market Fit](index/product-market-fit.md) | Finding and measuring PMF |

See [index/README.md](index/README.md) for the complete list of 87 topics.

## GitHub Pages Website

A modern web interface is available in the `docs/` folder. The website provides:

- **Full-text search** across all 303 episodes
- **Topic filtering** with 87 categories
- **Sort options** by date, views, duration, or guest name
- **Episode detail view** with complete transcripts
- **YouTube integration** with direct video links
- **Responsive design** for mobile and desktop

### Setting up GitHub Pages

1. Go to your repository Settings > Pages
2. Set Source to "Deploy from a branch"
3. Select branch: `main` and folder: `/docs`
4. Your site will be available at: `https://<username>.github.io/<repository-name>/`

Note: GitHub Pages works with private repositories if you have GitHub Pro, Team, or Enterprise.

### Regenerating Website Data

After updating transcripts, regenerate the data files:

```bash
python3 scripts/build-data.py
```

See [docs/README.md](docs/README.md) for more details.

## Rebuilding the Index

The index is generated using Claude CLI. To regenerate:

```bash
./scripts/build-index.sh
```

This processes transcripts through Claude to generate keyword tags. The script is idempotent - it skips episodes already present in keyword files, so it can be run multiple times safely.

## Usage with AI

### Loading Transcripts

Each transcript is a standalone markdown file that can be easily parsed by AI systems. The YAML frontmatter provides structured metadata that can be extracted programmatically.

### Example: Reading a Transcript

```python
import yaml

def read_transcript(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Split frontmatter and content
    parts = content.split('---')
    if len(parts) >= 3:
        frontmatter = yaml.safe_load(parts[1])
        transcript = '---'.join(parts[2:])
        return frontmatter, transcript
    return None, content

# Example usage
metadata, transcript = read_transcript('episodes/brian-chesky/transcript.md')
print(f"Guest: {metadata['guest']}")
print(f"Title: {metadata['title']}")
```

## Episode Count

This archive contains **303 transcripts** from Lenny's Podcast episodes.

## Data Sources

- **Transcripts**: Sourced from the Lenny's Podcast Transcripts Archive
- **Metadata**: Extracted from the [Lenny's Podcast YouTube channel](https://www.youtube.com/@LennysPodcast)

## Contributing

If you notice any issues with the transcripts or metadata, please open an issue or submit a pull request.

## Projects Built with These Transcripts

Here are some projects that have been built using this transcript archive:

**[Learn from Lenny](https://x.com/learnfromlenny)** by [@IamAdiG](https://x.com/IamAdiG) - An AI agent on X that provides credible product advice based on Lenny's podcasts. Tag it to get spot-on advice with no fluff.

**[Lenny Skills Database](https://refoundai.com/lenny-skills/)** by Refound AI - A searchable database of 86 actionable skills extracted from 297 podcast episodes. Learn how the best product teams actually work.

**[Lenny MCP](https://github.com/akshayvkt/lenny-mcp)** by [Akshay Chintalapati](https://x.com/akshayvkt) - A Model Context Protocol server that provides access to Lenny's podcast content for AI applications.

**[Recapio - Lenny's Podcast Summaries](https://recapio.com/channel/lennyspodcast)** - AI-generated summaries, transcripts, key insights, and chat interface for Lenny's Podcast episodes.

**[Lenny's Frameworks](https://lennys-frameworks.vercel.app/)** - A collection of frameworks and mental models extracted from Lenny's Podcast episodes.

**[Lenny Listens](https://lenny-listens.vercel.app/)** - An interactive tool for exploring and searching Lenny's Podcast content.

**[Lenny's Advice Arena](https://lennysadvicearena.lovable.app/)** - An interactive experience for exploring product advice from Lenny's Podcast.

**[Lenny Gallery](https://lennygallery.manus.space/)** by Alan Chan - An infographic gallery with visual summaries of key episodes, built with Manus AI.

Have you built something with these transcripts? Open a PR to add your project to this list!

## Disclaimer

This archive is for educational and research purposes. All content belongs to Lenny's Podcast and the respective guests. Please visit the official YouTube channel to support the creators.

## License

The transcripts are provided for personal and educational use. Please respect the original content creators' rights.
