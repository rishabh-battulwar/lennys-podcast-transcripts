// Global state
let episodes = [];
let topics = [];
let filteredEpisodes = [];
let fullEpisodesData = null;

// DOM elements
const episodesGrid = document.getElementById('episodes-grid');
const searchInput = document.getElementById('search');
const topicFilter = document.getElementById('topic-filter');
const sortBy = document.getElementById('sort-by');
const resultCount = document.getElementById('result-count');
const modal = document.getElementById('episode-modal');
const closeModal = document.querySelector('.close');

// Initialize app
async function init() {
    try {
        // Load episode index and topics
        const [episodesResponse, topicsResponse] = await Promise.all([
            fetch('data/episodes-index.json'),
            fetch('data/topics.json')
        ]);

        episodes = await episodesResponse.json();
        topics = await topicsResponse.json();

        // Populate topic filter
        populateTopicFilter();

        // Initial render
        filteredEpisodes = [...episodes];
        renderEpisodes();
        updateStats();

        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error loading data:', error);
        episodesGrid.innerHTML = '<div class="loading">Error loading episodes. Please refresh the page.</div>';
    }
}

// Populate topic filter dropdown
function populateTopicFilter() {
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic.name;
        option.textContent = `${topic.display_name} (${topic.count})`;
        topicFilter.appendChild(option);
    });
}

// Set up event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    topicFilter.addEventListener('change', handleFilter);
    sortBy.addEventListener('change', handleSort);
    closeModal.addEventListener('click', closeEpisodeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEpisodeModal();
        }
    });
}

// Handle search
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();

    filteredEpisodes = episodes.filter(episode => {
        return (
            episode.guest.toLowerCase().includes(query) ||
            episode.title.toLowerCase().includes(query) ||
            episode.description.toLowerCase().includes(query) ||
            episode.keywords.some(k => k.toLowerCase().includes(query))
        );
    });

    // Apply topic filter if active
    const selectedTopic = topicFilter.value;
    if (selectedTopic) {
        const topicEpisodes = topics.find(t => t.name === selectedTopic)?.episodes || [];
        const topicSlugs = topicEpisodes.map(e => e.slug);
        filteredEpisodes = filteredEpisodes.filter(e => topicSlugs.includes(e.slug));
    }

    handleSort();
}

// Handle topic filter
function handleFilter() {
    const selectedTopic = topicFilter.value;

    if (!selectedTopic) {
        filteredEpisodes = [...episodes];
    } else {
        const topicEpisodes = topics.find(t => t.name === selectedTopic)?.episodes || [];
        const topicSlugs = topicEpisodes.map(e => e.slug);
        filteredEpisodes = episodes.filter(e => topicSlugs.includes(e.slug));
    }

    // Apply search if active
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
        filteredEpisodes = filteredEpisodes.filter(episode => {
            return (
                episode.guest.toLowerCase().includes(query) ||
                episode.title.toLowerCase().includes(query) ||
                episode.description.toLowerCase().includes(query) ||
                episode.keywords.some(k => k.toLowerCase().includes(query))
            );
        });
    }

    handleSort();
}

// Handle sorting
function handleSort() {
    const sortValue = sortBy.value;

    filteredEpisodes.sort((a, b) => {
        switch (sortValue) {
            case 'date-desc':
                return new Date(b.publish_date) - new Date(a.publish_date);
            case 'date-asc':
                return new Date(a.publish_date) - new Date(b.publish_date);
            case 'guest-asc':
                return a.guest.localeCompare(b.guest);
            case 'views-desc':
                return b.view_count - a.view_count;
            case 'duration-desc':
                return b.duration_seconds - a.duration_seconds;
            case 'duration-asc':
                return a.duration_seconds - b.duration_seconds;
            default:
                return 0;
        }
    });

    renderEpisodes();
    updateStats();
}

// Render episodes
function renderEpisodes() {
    if (filteredEpisodes.length === 0) {
        episodesGrid.innerHTML = `
            <div class="no-results">
                <h2>No episodes found</h2>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    episodesGrid.innerHTML = filteredEpisodes.map(episode => `
        <div class="episode-card" onclick="showEpisodeDetail('${episode.slug}')">
            <div class="episode-guest">${escapeHtml(episode.guest)}</div>
            <div class="episode-title">${escapeHtml(episode.title)}</div>
            <div class="episode-meta">
                <span>📅 ${formatDate(episode.publish_date)}</span>
                <span>⏱️ ${episode.duration}</span>
                <span>👁️ ${formatNumber(episode.view_count)}</span>
            </div>
            ${episode.description ? `<div class="episode-description">${escapeHtml(episode.description)}</div>` : ''}
            ${episode.keywords.length > 0 ? `
                <div class="episode-keywords">
                    ${episode.keywords.slice(0, 5).map(k => `<span class="keyword-tag">${escapeHtml(k)}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Update stats
function updateStats() {
    const total = episodes.length;
    const showing = filteredEpisodes.length;

    if (showing === total) {
        resultCount.textContent = `Showing all ${total} episodes`;
    } else {
        resultCount.textContent = `Showing ${showing} of ${total} episodes`;
    }
}

// Show episode detail
async function showEpisodeDetail(slug) {
    const episode = episodes.find(e => e.slug === slug);
    if (!episode) return;

    // Load full episode data with transcript if not already loaded
    if (!fullEpisodesData) {
        try {
            const response = await fetch('data/episodes.json');
            fullEpisodesData = await response.json();
        } catch (error) {
            console.error('Error loading full episode data:', error);
            alert('Error loading transcript. Please try again.');
            return;
        }
    }

    const fullEpisode = fullEpisodesData.find(e => e.slug === slug);
    if (!fullEpisode) return;

    const detailDiv = document.getElementById('episode-detail');
    detailDiv.innerHTML = `
        <div class="episode-detail-header">
            <div class="episode-detail-guest">${escapeHtml(fullEpisode.guest)}</div>
            <div class="episode-detail-title">${escapeHtml(fullEpisode.title)}</div>
            <div class="episode-detail-meta">
                <span>📅 Published: ${formatDate(fullEpisode.publish_date)}</span>
                <span>⏱️ Duration: ${fullEpisode.duration}</span>
                <span>👁️ Views: ${formatNumber(fullEpisode.view_count)}</span>
            </div>
            ${fullEpisode.youtube_url ? `
                <a href="${fullEpisode.youtube_url}" target="_blank" class="youtube-link">
                    ▶️ Watch on YouTube
                </a>
            ` : ''}
        </div>

        ${fullEpisode.description ? `
            <div class="episode-detail-description">
                ${escapeHtml(fullEpisode.description)}
            </div>
        ` : ''}

        ${fullEpisode.keywords.length > 0 ? `
            <div class="episode-detail-keywords">
                ${fullEpisode.keywords.map(k => `<span class="keyword-tag">${escapeHtml(k)}</span>`).join('')}
            </div>
        ` : ''}

        <div class="transcript-section">
            <h2>Transcript</h2>
            <div class="transcript-content">${escapeHtml(fullEpisode.transcript)}</div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close episode modal
function closeEpisodeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatNumber(num) {
    if (!num) return '0';
    return num.toLocaleString();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
