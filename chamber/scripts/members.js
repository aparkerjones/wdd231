/**
 * Members Directory - Displays chamber members in grid or list view
 */

// Page elements
const memberContainer = document.getElementById('memberCards');
const gridButton = document.getElementById('gridView');
const listButton = document.getElementById('listView');

// Membership labels
const MEMBERSHIP_LABELS = {
  1: 'Non-Profit',
  2: 'Silver',
  3: 'Gold'
};

/**
 * Fetch member data from JSON source and display in current view
 */
async function fetchMembers() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    memberContainer.innerHTML = '<p class="load-error">Unable to load member data. Please try again later.</p>';
    console.error('Failed to fetch members:', error);
  }
}

/**
 * Render member cards from data
 * @param {Array} members - Array of member objects
 */
function displayMembers(members) {
  memberContainer.innerHTML = members
    .map(member => `
      <article class="member-card">
        <img
          src="${member.image}"
          alt="${member.name} logo"
          loading="lazy"
          width="200"
          height="130"
          onerror="this.style.display='none'"
        >
        <h3>${member.name}</h3>
        <p class="member-address">${member.address}</p>
        <p class="member-phone">${member.phone}</p>
        <a href="${member.website}" target="_blank" rel="noopener noreferrer">
          ${member.website.replace(/^https?:\/\//, '')}
        </a>
        ${member.description ? `<p class="member-desc">${member.description}</p>` : ''}
        <span class="membership-badge level-${member.membershipLevel}">
          ${MEMBERSHIP_LABELS[member.membershipLevel] || 'Member'}
        </span>
      </article>
    `).join('');
}

/**
 * Toggle between grid and list view
 * @param {string} view - 'grid' or 'list'
 */
function setView(view) {
  const isGrid = view === 'grid';

  memberContainer.classList.toggle('grid-view', isGrid);
  memberContainer.classList.toggle('list-view', !isGrid);

  gridButton.classList.toggle('active', isGrid);
  listButton.classList.toggle('active', !isGrid);

  gridButton.setAttribute('aria-pressed', String(isGrid));
  listButton.setAttribute('aria-pressed', String(!isGrid));
}

// Initialize view toggle buttons
if (gridButton && listButton) {
  gridButton.addEventListener('click', () => setView('grid'));
  listButton.addEventListener('click', () => setView('list'));
}

// Load members on page load
fetchMembers();
