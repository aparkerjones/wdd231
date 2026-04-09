import { fetchParks } from "./modules/parks-service.js";

const spotlightContainer = document.getElementById("spotlightContainer");
const spotlightStatus = document.getElementById("spotlightStatus");

function pickRandomPark(parks) {
    const randomIndex = Math.floor(Math.random() * parks.length);
    return parks[randomIndex];
}

function buildSpotlightCard(park) {
    const activities = Array.isArray(park.activities)
        ? park.activities.slice(0, 3).join(" | ")
        : "General Park Visit";

    return `
        <article class="park-card spotlight-card" aria-label="Featured park: ${park.fullName}">
            <img class="park-card-image" src="${park.imageUrl}" alt="${park.imageAlt}" width="640" height="400" loading="lazy" decoding="async">
            <div class="park-card-content">
                <p class="park-card-meta">${park.designation} | ${park.states}</p>
                <h3>${park.fullName}</h3>
                <p>${park.description}</p>
                <p class="park-card-activities"><strong>Popular activities:</strong> ${activities}</p>
                <div class="park-card-actions">
                    <a class="site-action site-action-outline" href="explore.html">Browse More Parks</a>
                    <a class="site-action site-action-solid" href="${park.website}" target="_blank" rel="noopener noreferrer">Visit Park Site</a>
                </div>
            </div>
        </article>
    `;
}

async function initSpotlight() {
    if (!spotlightContainer) {
        return;
    }

    try {
        const parks = await fetchParks();
        if (!Array.isArray(parks) || parks.length === 0) {
            spotlightContainer.innerHTML = "<p class=\"empty-state\">Featured park is unavailable right now. Please check back soon.</p>";
            if (spotlightStatus) {
                spotlightStatus.textContent = "Featured park unavailable.";
            }
            return;
        }

        const randomPark = pickRandomPark(parks);
        spotlightContainer.innerHTML = buildSpotlightCard(randomPark);

        if (spotlightStatus) {
            spotlightStatus.textContent = `${randomPark.fullName} is the featured park.`;
        }
    } catch {
        spotlightContainer.innerHTML = "<p class=\"empty-state\">Featured park is unavailable right now. Please refresh to try again.</p>";
        if (spotlightStatus) {
            spotlightStatus.textContent = "Featured park failed to load.";
        }
    }
}

initSpotlight();
