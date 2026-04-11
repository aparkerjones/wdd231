/**
 * Home Page Script - Weather and Business Spotlights
 *
 * Features:
 * 1. Shows a demo-only weather unavailable notice
 * 2. Shows random featured business member spotlights
 */

// Membership Labels - Shared constant also used in members.js
const MEMBERSHIP_LABELS = {
  1: 'Non-Profit',
  2: 'Silver',
  3: 'Gold'
};

/**
 * Get random items from an array
 * @param {Array} array - Array to select from
 * @param {number} count - How many items to return
 * @returns {Array} Random subset of the array
 */
function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Display a weather placeholder message for demo mode
 */
function fetchWeather() {
  const weatherContainer = document.querySelector('.current-weather');
  const forecastContainer = document.getElementById('forecastContainer');

  if (weatherContainer) {
    weatherContainer.innerHTML = '<p class="error">Weather unavailable: API key removed for security (demo site).</p>';
  }

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
  }
}

/**
 * Fetch member data and display random featured business spotlights
 * Shows 2-3 randomly selected Gold/Silver members on each page load
 */
async function fetchSpotlights() {
  const spotlightContainer = document.getElementById('spotlightCards');

  try {
    console.log('Fetching member data...');

    const response = await fetch('data/members.json');
    if (!response.ok) {
      throw new Error('Failed to fetch members data');
    }

    const members = await response.json();
    console.log(`Loaded ${members.length} members`);

    const premiumMembers = members.filter(member => member.membershipLevel === 2 || member.membershipLevel === 3);
    console.log(`Found ${premiumMembers.length} premium members`);

    const selectedMembers = getRandomElements(premiumMembers, 3);

    if (selectedMembers.length === 0) {
      spotlightContainer.innerHTML = '<p>No premium members available at this time.</p>';
      return;
    }

    let spotlightHTML = '';
    selectedMembers.forEach(member => {
      const level = MEMBERSHIP_LABELS[member.membershipLevel] || 'Member';
      spotlightHTML += `
        <article class="spotlight-card" aria-label="${member.name} spotlight">
          <div class="spotlight-image-container">
            <img src="${member.image}" alt="${member.name} logo" class="spotlight-image" loading="lazy">
          </div>
          <h3>${member.name}</h3>
          <p class="membership-badge">${level}</p>
          <div class="spotlight-details">
            <p><strong>Phone:</strong> <a href="tel:${member.phone.replace(/\D/g, '')}">${member.phone}</a></p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Site</a></p>
          </div>
        </article>
      `;
    });

    spotlightContainer.innerHTML = spotlightHTML;
    console.log(`Displayed ${selectedMembers.length} spotlight members`);

  } catch (error) {
    console.error('Spotlight fetch error:', error.message);
    spotlightContainer.innerHTML = '<p class="error">Unable to load member spotlights at this time.</p>';
  }
}

/**
 * Initialize home page by fetching weather and spotlights
 */
function init() {
  console.log('Initializing home page features...');
  fetchWeather();
  fetchSpotlights();
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
