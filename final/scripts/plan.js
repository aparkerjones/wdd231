import { clearPlan, getPlan, removeFromPlan } from "./modules/plan-storage.js";

const planSummary = document.getElementById("planSummary");
const plannedParksContainer = document.getElementById("plannedParks");
const clearPlanButton = document.getElementById("clearPlan");
const emailPlanForm = document.getElementById("emailPlanForm");
const emailPlanButton = document.getElementById("emailPlanButton");
const emailStatus = document.getElementById("emailStatus");

function buildPlannedParkMarkup(park) {
    return `
        <article class="planned-park-card" aria-label="${park.fullName}">
            <img src="${park.imageUrl}" alt="${park.imageAlt}" width="640" height="400" loading="lazy">
            <div class="planned-park-content">
                <p class="park-card-meta">${park.designation} | ${park.states}</p>
                <h3>${park.fullName}</h3>
                <div class="park-card-actions">
                    <a class="site-action site-action-outline" href="explore.html">View Explore</a>
                    <button type="button" class="site-action site-action-solid" data-action="remove" data-park-id="${park.id}">Remove</button>
                </div>
            </div>
        </article>
    `;
}

function renderPlan() {
    const plannedParks = getPlan();

    planSummary.textContent = `${plannedParks.length} park${plannedParks.length === 1 ? "" : "s"} saved in your plan.`;

    // Keep call-to-action buttons aligned with whether the plan has any parks.
    if (plannedParks.length === 0) {
        plannedParksContainer.innerHTML = "<p class=\"empty-state\">Your plan is empty. Go to Explore and save parks you want to visit.</p>";
        clearPlanButton.disabled = true;
        if (emailPlanButton) {
            emailPlanButton.disabled = true;
        }
        if (emailStatus) {
            emailStatus.textContent = "Save at least one park to continue.";
        }
        return;
    }

    clearPlanButton.disabled = false;
    if (emailPlanButton) {
        emailPlanButton.disabled = false;
    }
    if (emailStatus) {
        emailStatus.textContent = `${plannedParks.length} park${plannedParks.length === 1 ? "" : "s"} saved. Submit the form to review your details.`;
    }
    plannedParksContainer.innerHTML = plannedParks.map((park) => buildPlannedParkMarkup(park)).join("");
}

if (emailPlanForm) {
    emailPlanForm.addEventListener("submit", (event) => {
        const plannedParks = getPlan();
        if (plannedParks.length === 0) {
            event.preventDefault();
            if (emailStatus) {
                emailStatus.textContent = "Save at least one park before submitting.";
            }
        }
    });
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
