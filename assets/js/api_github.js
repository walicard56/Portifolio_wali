'use strict';

// Language → color mapping (GitHub brand colors)
const LANGUAGE_COLORS = {
  Python: '#3572A5',
  JavaScript: '#F1E05A',
  TypeScript: '#2B7489',
  HTML: '#E34C26',
  CSS: '#563D7C',
  'Jupyter Notebook': '#DA5B0B',
  Shell: '#89E051',
  C: '#555555',
  'C++': '#F34B7D',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Java: '#B07219',
};

// Language → portfolio category
const LANGUAGE_CATEGORIES = {
  Python: 'AI / Backend',
  JavaScript: 'Web Development',
  TypeScript: 'Web Development',
  HTML: 'Web Development',
  CSS: 'Web Development',
  'Jupyter Notebook': 'Data Science',
  Shell: 'Automation',
  C: 'Low-level',
  'C++': 'Low-level',
};

// Fallback project images (cycle through existing assets)
const FALLBACK_IMAGES = [
  './assets/images/project-1.jpg',
  './assets/images/project-2.jpg',
  './assets/images/project-3.jpg',
];

// Custom preview images per repo (raw.githubusercontent.com URLs)
// Add more repos here whenever you upload a screenshot to a repo
const REPO_IMAGES = {
  'Bot-IQ-Option-telegram-SQLITE': 'https://raw.githubusercontent.com/walicard56/Bot-IQ-Option-telegram-SQLITE/main/Screenshot_20260414_161857_Telegram.jpg',
};

function formatRepoName(name) {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function buildProjectCard(repo, index) {
  const language   = repo.language || 'General';
  const category   = LANGUAGE_CATEGORIES[language] || 'Other';
  const color      = LANGUAGE_COLORS[language]      || '#858585';
  const image      = REPO_IMAGES[repo.name] ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const stars      = repo.stargazers_count || 0;
  const forks      = repo.forks_count      || 0;
  const description = repo.description
    ? repo.description.slice(0, 90) + (repo.description.length > 90 ? '…' : '')
    : 'No description provided.';

  const li = document.createElement('li');
  li.className = 'project-item active';
  li.setAttribute('data-filter-item', '');
  li.setAttribute('data-category', category.toLowerCase());

  li.innerHTML = `
    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${repo.name} on GitHub">

      <figure class="project-img">
        <div class="project-item-icon-box">
          <ion-icon name="eye-outline"></ion-icon>
        </div>
        <img
          src="${image}"
          alt="${formatRepoName(repo.name)} preview"
          loading="lazy"
        >
      </figure>

      <div class="project-content">

        <div class="project-meta">
          <span class="project-lang-dot" style="background:${color};"></span>
          <span class="project-lang-label">${language}</span>

          ${stars > 0 ? `
          <span class="project-stat">
            <ion-icon name="star-outline"></ion-icon>
            ${stars}
          </span>` : ''}

          ${forks > 0 ? `
          <span class="project-stat">
            <ion-icon name="git-branch-outline"></ion-icon>
            ${forks}
          </span>` : ''}
        </div>

        <h4 class="project-title">${formatRepoName(repo.name)}</h4>
        <p class="project-description">${description}</p>
        <span class="project-category-badge">${category}</span>

      </div>
    </a>
  `;

  return li;
}

async function loadGithubRepos() {
  const username  = 'walicard56';
  const container = document.getElementById('github-projects');

  if (!container) return;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );

    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const repos = await response.json();

    const filtered = repos
      .filter(repo => !repo.fork && !repo.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 12);

    // Clear loading skeletons
    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = '<p class="no-projects">No public projects found.</p>';
      return;
    }

    filtered.forEach((repo, index) => {
      container.appendChild(buildProjectCard(repo, index));
    });

    // Re-run filter so the active filter button is respected after load
    const activeBtn = document.querySelector('[data-filter-btn].active');
    if (activeBtn) {
      const value = activeBtn.innerText.toLowerCase();
      if (value !== 'all') {
        document.querySelectorAll('[data-filter-item]').forEach(item => {
          item.classList.toggle('active', item.dataset.category === value);
        });
      }
    }

  } catch (error) {
    console.error('Failed to load GitHub projects:', error);
    container.innerHTML = `
      <li class="no-projects">
        <p>Could not load projects. <a href="https://github.com/${username}" target="_blank" rel="noopener">View on GitHub →</a></p>
      </li>
    `;
  }
}

loadGithubRepos();
