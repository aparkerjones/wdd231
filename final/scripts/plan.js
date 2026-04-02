import { clearPlan, getPlan, removeFromPlan } from "./modules/plan-storage.js";

const planSummary = document.getElementById("planSummary");
const plannedParksContainer = document.getElementById("plannedParks");
const clearPlanButton = document.getElementById("clearPlan");

function buildPlannedParkMarkup(park) {
    return `
        <article class="planned-park-card" aria-label="${park.fullName}">
            <img src="${park.imageUrl}" alt="${park.imageAlt}" width="640" height="400" loading="lazy">
            <div class="planned-park-content">
                <p class="park-card-meta">${park.designation} | ${park.states}</p>
                <h3>${park.fullName}</h3>
                <div class="park-card-actions">
                    <a class="btn btn-secondary" href="explore.html">View Explore</a>
                    <button type="button" class="btn btn-primary" data-action="remove" data-park-id="${park.id}">Remove</button>
                </div>
            </div>
        </article>
    `;
}

function renderPlan() {
    const plannedParks = getPlan();

    planSummary.textContent = `${plannedParks.length} park${plannedParks.length === 1 ? "" : "s"} saved in your plan.`;

    if (plannedParks.length === 0) {
        plannedParksContainer.innerHTML = "<p class=\"empty-state\">Your plan is empty. Go to Explore and save parks you want to visit.</p>";
        clearPlanButton.disabled = true;
        return;
    }

    clearPlanButton.disabled = false;
    plannedParksContainer.innerHTML = plannedParks.map((park) => buildPlannedParkMarkup(park)).join("");
}

plannedParksContainer.addEventListener("click", (event) => {
    const removeButton = event.target.closest("button[data-action='remove']");
    if (!removeButton) {
        return;
    }

    removeFromPlan(removeButton.dataset.parkId);
    renderPlan();
});

clearPlanButton.addEventListener("click", () => {
    clearPlan();
    renderPlan();
});

renderPlan();
