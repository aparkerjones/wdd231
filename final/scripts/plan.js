import { clearPlan, getPlan, removeFromPlan } from "./modules/plan-storage.js";

const planSummary = document.getElementById("planSummary");
const plannedParksContainer = document.getElementById("plannedParks");
const clearPlanButton = document.getElementById("clearPlan");
const emailPlanForm = document.getElementById("emailPlanForm");
const emailPlanButton = document.getElementById("emailPlanButton");
const emailStatus = document.getElementById("emailStatus");
const recipientEmailInput = document.getElementById("recipientEmail");
const ccEmailInput = document.getElementById("ccEmail");
const emailSubjectInput = document.getElementById("emailSubject");
const notesInput = document.getElementById("notes");

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

    if (plannedParks.length === 0) {
        plannedParksContainer.innerHTML = "<p class=\"empty-state\">Your plan is empty. Go to Explore and save parks you want to visit.</p>";
        clearPlanButton.disabled = true;
        if (emailPlanButton) {
            emailPlanButton.disabled = true;
        }
        if (emailStatus) {
            emailStatus.textContent = "Save at least one park to create an email draft.";
        }
        return;
    }

    clearPlanButton.disabled = false;
    if (emailPlanButton) {
        emailPlanButton.disabled = false;
    }
    if (emailStatus) {
        emailStatus.textContent = `${plannedParks.length} park${plannedParks.length === 1 ? "" : "s"} will be included in your email draft.`;
    }
    plannedParksContainer.innerHTML = plannedParks.map((park) => buildPlannedParkMarkup(park)).join("");
}

function buildParkLines(plannedParks) {
    return plannedParks
        .map((park, index) => {
            const lines = [
                `${index + 1}. ${park.fullName}`,
                `   Designation: ${park.designation || "Not specified"}`,
                `   States: ${park.states || "Not specified"}`,
                `   Image description: ${park.imageAlt || "Not specified"}`,
                `   Picture link: ${park.imageUrl || "Not available"}`
            ];

            return lines.join("\n");
        })
        .join("\n\n");
}

function buildEmailBody(plannedParks) {
    const notes = notesInput?.value.trim() || "None";
    const parkLines = buildParkLines(plannedParks);

    return [
        "Hello, future me.",
        "",
        "Here is my current national parks plan from National Parks & Trails.",
        "",
        "Picture links are included for each park.",
        "",
        "Saved parks:",
        parkLines,
        "",
        "Trip notes:",
        notes,
        "",
        "Sent from the National Parks & Trails plan page."
    ].join("\n");
}

function openEmailDraft(plannedParks) {
    const recipientEmail = recipientEmailInput?.value.trim();
    const ccEmail = ccEmailInput?.value.trim();
    const subject = emailSubjectInput?.value.trim() || "My National Parks Plan Reminder";
    const body = buildEmailBody(plannedParks);

    if (!recipientEmail) {
        return;
    }

    const queryParts = [
        `subject=${encodeURIComponent(subject)}`,
        `body=${encodeURIComponent(body)}`
    ];

    if (ccEmail) {
        queryParts.push(`cc=${encodeURIComponent(ccEmail)}`);
    }

    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?${queryParts.join("&")}`;
    window.location.href = mailtoUrl;
}

if (emailPlanForm) {
    emailPlanForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const plannedParks = getPlan();
        if (plannedParks.length === 0) {
            if (emailStatus) {
                emailStatus.textContent = "Save at least one park before creating an email draft.";
            }
            return;
        }

        if (emailStatus) {
            emailStatus.textContent = "Opening your email app with a prefilled draft.";
        }

        openEmailDraft(plannedParks);
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
