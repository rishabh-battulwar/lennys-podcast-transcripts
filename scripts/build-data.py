#!/usr/bin/env python3
"""
Build JSON data file from all episode transcripts for GitHub Pages.
This script extracts YAML frontmatter and transcript content from all episodes.
"""

import json
import os
import re
from pathlib import Path
import yaml

def extract_frontmatter_and_content(file_path):
    """Extract YAML frontmatter and transcript content from a markdown file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match YAML frontmatter between --- markers
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
    if not match:
        return None, None

    frontmatter_str = match.group(1)
    transcript_content = match.group(2)

    try:
        frontmatter = yaml.safe_load(frontmatter_str)
    except yaml.YAMLError:
        return None, None

    return frontmatter, transcript_content

def get_episode_slug(episode_dir):
    """Get the slug from the episode directory name."""
    return os.path.basename(episode_dir)

def build_episodes_data():
    """Build a JSON file with all episode data."""
    episodes_dir = Path(__file__).parent.parent / 'episodes'
    output_file = Path(__file__).parent.parent / 'docs' / 'data' / 'episodes.json'

    episodes = []

    # Iterate through all episode directories
    for episode_dir in sorted(episodes_dir.iterdir()):
        if not episode_dir.is_dir():
            continue

        transcript_file = episode_dir / 'transcript.md'
        if not transcript_file.exists():
            continue

        frontmatter, transcript = extract_frontmatter_and_content(transcript_file)
        if not frontmatter:
            print(f"Warning: Could not parse {transcript_file}")
            continue

        slug = get_episode_slug(episode_dir)

        # Build episode object
        publish_date = frontmatter.get('publish_date', '')
        if hasattr(publish_date, 'isoformat'):
            publish_date = publish_date.isoformat()

        episode = {
            'slug': slug,
            'guest': frontmatter.get('guest', ''),
            'title': frontmatter.get('title', ''),
            'youtube_url': frontmatter.get('youtube_url', ''),
            'video_id': frontmatter.get('video_id', ''),
            'publish_date': str(publish_date),
            'description': frontmatter.get('description', ''),
            'duration_seconds': frontmatter.get('duration_seconds', 0),
            'duration': frontmatter.get('duration', ''),
            'view_count': frontmatter.get('view_count', 0),
            'channel': frontmatter.get('channel', ''),
            'keywords': frontmatter.get('keywords', []),
            'transcript': transcript.strip()
        }

        episodes.append(episode)
        print(f"Processed: {episode['guest']}")

    # Create output directory if it doesn't exist
    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Write full JSON file (with transcripts)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(episodes, f, indent=2, ensure_ascii=False)

    print(f"\nSuccessfully processed {len(episodes)} episodes")
    print(f"Output written to: {output_file}")

    # Calculate file size
    size_mb = output_file.stat().st_size / (1024 * 1024)
    print(f"File size: {size_mb:.2f} MB")

    # Create lightweight index without full transcripts
    index_file = Path(__file__).parent.parent / 'docs' / 'data' / 'episodes-index.json'
    episodes_index = []
    for episode in episodes:
        # Create a copy without the transcript
        episode_meta = {k: v for k, v in episode.items() if k != 'transcript'}
        # Add transcript preview (first 500 chars)
        episode_meta['transcript_preview'] = episode['transcript'][:500] + '...' if len(episode['transcript']) > 500 else episode['transcript']
        episodes_index.append(episode_meta)

    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(episodes_index, f, indent=2, ensure_ascii=False)

    index_size_kb = index_file.stat().st_size / 1024
    print(f"Index file written to: {index_file}")
    print(f"Index file size: {index_size_kb:.2f} KB")

    return episodes

def build_topics_data():
    """Build a JSON file with all topic data."""
    index_dir = Path(__file__).parent.parent / 'index'
    output_file = Path(__file__).parent.parent / 'docs' / 'data' / 'topics.json'

    topics = []

    # Read all topic files
    for topic_file in sorted(index_dir.glob('*.md')):
        if topic_file.name == 'README.md' or topic_file.name == 'episodes.md':
            continue

        topic_name = topic_file.stem

        with open(topic_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract episode links
        episode_pattern = r'\[(.*?)\]\(\.\./episodes/(.*?)/transcript\.md\)'
        matches = re.findall(episode_pattern, content)

        episodes = [{'guest': guest, 'slug': slug} for guest, slug in matches]

        topics.append({
            'name': topic_name,
            'display_name': topic_name.replace('-', ' ').title(),
            'count': len(episodes),
            'episodes': episodes
        })

    # Sort by count descending
    topics.sort(key=lambda x: x['count'], reverse=True)

    # Write JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(topics, f, indent=2, ensure_ascii=False)

    print(f"\nSuccessfully processed {len(topics)} topics")
    print(f"Output written to: {output_file}")

if __name__ == '__main__':
    print("Building episode data...")
    build_episodes_data()

    print("\nBuilding topic data...")
    build_topics_data()

    print("\nDone! Data files created in docs/data/")
