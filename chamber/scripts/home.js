/**
 * Home Page Script - Weather and Business Spotlights
 *
 * Features:
 * 1. Displays current weather and 3-day forecast from OpenWeatherMap API
 * 2. Shows random featured business member spotlights
 */

// Configuration - Location and API Settings
const MERIDIAN_LAT = 43.5911;
const MERIDIAN_LON = -116.3915;
const API_KEY = 'ca21ca44e5ae3978cc9b2b29fe28d9ef';

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
 * Fetch current weather and 3-day forecast from OpenWeatherMap API
 * Displays weather information and handles errors gracefully
 */
async function fetchWeather() {
  const weatherContainer = document.querySelector('.current-weather');
  const forecastContainer = document.getElementById('forecastContainer');

  if (weatherContainer) {
    weatherContainer.innerHTML = '<p class="loading">Loading weather data...</p>';
  }

  try {
    console.log('Fetching weather for Meridian, ID...');

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${MERIDIAN_LAT}&lon=${MERIDIAN_LON}&appid=${API_KEY}&units=imperial`;
    const weatherResponse = await fetch(currentWeatherUrl);
    const weatherData = await weatherResponse.json();

    if (!weatherResponse.ok) {
      console.error('API Error:', weatherResponse.status, weatherResponse.statusText);
      console.error('Message:', weatherData.message);
      throw new Error('Unable to fetch current weather');
    }

    console.log('Weather data received:', weatherData);

    const currentTemperature = Math.round(weatherData.main.temp);
    const weatherDescription = weatherData.weather[0].main;
    const weatherIcon = weatherData.weather[0].icon;

    const currentWeatherHTML = `
      <div class="current-weather-content">
        <div class="weather-icon-container">
          <img
            src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png"
            alt="${weatherDescription}"
            class="weather-icon"
            width="80"
            height="80"
          >
        </div>
        <div class="weather-info">
          <p class="temperature">${currentTemperature}°F</p>
          <p class="description">${weatherDescription}</p>
        </div>
      </div>
    `;
    weatherContainer.innerHTML = currentWeatherHTML;

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${MERIDIAN_LAT}&lon=${MERIDIAN_LON}&appid=${API_KEY}&units=imperial`;
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (!forecastResponse.ok) {
      console.error('Forecast API Error:', forecastResponse.status);
      throw new Error('Unable to fetch forecast data');
    }

    console.log('Forecast data received');

    // Group forecast data by day for accurate daily highs/lows
    const forecastDays = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      if (!forecastDays[date]) {
        forecastDays[date] = {
          temps: [],
          descriptions: [],
          icons: []
        };
      }
      
      // Collect all temps for the day
      forecastDays[date].temps.push(item.main.temp_max, item.main.temp_min);
      forecastDays[date].descriptions.push(item.weather[0].main);
      forecastDays[date].icons.push(item.weather[0].icon);
    });

    // Get first 3 days
    const forecast = Object.entries(forecastDays).slice(0, 3);
    let forecastHTML = '';

    forecast.forEach(([date, data]) => {
      // Calculate daily high and low from all readings
      const maxTemp = Math.round(Math.max(...data.temps));
      const minTemp = Math.round(Math.min(...data.temps));
      const description = data.descriptions[0];
      const icon = data.icons[0];

      forecastHTML += `
        <article class="forecast-day">
          <h4>${date}</h4>
          <img
            src="https://openweathermap.org/img/wn/${icon}.png"
            alt="${description}"
            class="forecast-icon"
            width="50"
            height="50"
          >
          <p class="forecast-description">${description}</p>
          <p class="forecast-temp"><strong>${maxTemp}°F</strong> / <span class="min-temp">${minTemp}°F</span></p>
        </article>
      `;
    });

    forecastContainer.innerHTML = forecastHTML;
    console.log('Weather updated successfully');

  } catch (error) {
    console.error('Weather fetch error:', error.message);

    const errorHTML = `
      <p class="error">Unable to load weather at this time. Please try again later.</p>
    `;
    weatherContainer.innerHTML = errorHTML;
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
