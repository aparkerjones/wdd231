import { fetchParks } from "./modules/parks-service.js";
import { addToPlan, isInPlan } from "./modules/plan-storage.js";

const searchInput = document.getElementById("parkSearch");
const stateFilter = document.getElementById("stateFilter");
const activityFilter = document.getElementById("activityFilter");
const sortFilter = document.getElementById("sortFilter");
const resetFiltersButton = document.getElementById("resetFilters");
const parksContainer = document.getElementById("parksContainer");
const resultsSummary = document.getElementById("resultsSummary");
const dataStatus = document.getElementById("dataStatus");

const detailsDialog = document.getElementById("parkDetailsDialog");
const closeDialogButton = document.getElementById("closeDialog");
const detailTitle = document.getElementById("detailTitle");
const detailMeta = document.getElementById("detailMeta");
const detailDescription = document.getElementById("detailDescription");
const detailActivities = document.getElementById("detailActivities");
const detailWebsite = document.getElementById("detailWebsite");
const IMAGE_PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

let allParks = [];
let parkImageObserver = null;

// Ensure hidden state on initial load for browser consistency.
detailsDialog.removeAttribute("open");

function openDetailsDialog() {
    if (detailsDialog.hasAttribute("open")) {
        return;
    }

    if (typeof detailsDialog.showModal === "function") {
        detailsDialog.showModal();
        return;
    }

    detailsDialog.setAttribute("open", "");
}

function closeDetailsDialog() {
    if (typeof detailsDialog.close === "function") {
        detailsDialog.close();
    }

    detailsDialog.removeAttribute("open");
}

function getParksForDisplay() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedState = stateFilter.value;
    const selectedActivity = activityFilter.value;
    const selectedSort = sortFilter.value;

    const filtered = allParks.filter((park) => {
        const searchMatch =
            query.length === 0 ||
            park.fullName.toLowerCase().includes(query) ||
            park.description.toLowerCase().includes(query) ||
            park.states.toLowerCase().includes(query);

        const stateMatch = selectedState === "all" || park.states.split(",").map((state) => state.trim()).includes(selectedState);
        const activityMatch = selectedActivity === "all" || park.activities.includes(selectedActivity);

        return searchMatch && stateMatch && activityMatch;
    });

    const sorted = [...filtered];
    if (selectedSort === "name") {
        sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }
    if (selectedSort === "state") {
        sorted.sort((a, b) => a.states.localeCompare(b.states));
    }

    return sorted;
}

function makeCardMarkup(park) {
    const parkActivities = park.activities.slice(0, 3).join(" | ");
    const alreadySaved = isInPlan(park.id);

    return `
        <article class="park-card" aria-label="${park.fullName}">
            <img class="park-card-image" src="${IMAGE_PLACEHOLDER}" data-src="${park.imageUrl}" alt="${park.imageAlt}" width="640" height="400" loading="lazy" decoding="async">
            <div class="park-card-content">
                <p class="park-card-meta">${park.designation} | ${park.states}</p>
                <h3>${park.fullName}</h3>
                <p>${park.description}</p>
                <p class="park-card-activities"><strong>Popular activities:</strong> ${parkActivities}</p>
                <div class="park-card-actions">
                    <button type="button" class="site-action site-action-outline" data-action="details" data-park-id="${park.id}">Details</button>
                    <button type="button" class="site-action site-action-solid" data-action="save" data-park-id="${park.id}" ${alreadySaved ? "disabled" : ""}>
                        ${alreadySaved ? "Saved" : "Save to Plan"}
                    </button>
                </div>
            </div>
        </article>
    `;
}

function loadParkImage(imageElement) {
    const imageSource = imageElement.dataset.src;
    if (!imageSource) {
        return;
    }

    imageElement.src = imageSource;
    imageElement.removeAttribute("data-src");
}

function initLazyImages() {
    const images = parksContainer.querySelectorAll("img[data-src]");

    if (parkImageObserver) {
        parkImageObserver.disconnect();
        parkImageObserver = null;
    }

    if (!("IntersectionObserver" in window)) {
        images.forEach((image) => {
            loadParkImage(image);
        });
        return;
    }

    parkImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            loadParkImage(entry.target);
            observer.unobserve(entry.target);
        });
    }, {
        root: null,
        rootMargin: "120px 0px",
        threshold: 0.01
    });

    images.forEach((image) => {
        parkImageObserver.observe(image);
    });
}

function renderResults(parks) {
    resultsSummary.textContent = `Showing ${parks.length} of ${allParks.length} parks.`;

    if (parks.length === 0) {
        parksContainer.innerHTML = "<p class=\"empty-state\">No parks matched your current filters. Try another state, activity, or search term.</p>";
        if (parkImageObserver) {
            parkImageObserver.disconnect();
            parkImageObserver = null;
        }
        return;
    }

    parksContainer.innerHTML = parks.map((park) => makeCardMarkup(park)).join("");
    initLazyImages();
}

function setFilterOptions(parks) {
    const states = [...new Set(parks.flatMap((park) => park.states.split(",").map((state) => state.trim())))].sort();
    const activities = [...new Set(parks.flatMap((park) => park.activities))].sort();

    states.forEach((stateCode) => {
        stateFilter.insertAdjacentHTML("beforeend", `<option value="${stateCode}">${stateCode}</option>`);
    });

    activities.forEach((activity) => {
        activityFilter.insertAdjacentHTML("beforeend", `<option value="${activity}">${activity}</option>`);
    });
}

function showParkDetails(parkId) {
    const selectedPark = allParks.find((park) => park.id === parkId);
    if (!selectedPark) {
        return;
    }

    detailTitle.textContent = selectedPark.fullName;
    detailMeta.textContent = `${selectedPark.designation} | ${selectedPark.states}`;
    detailDescription.textContent = selectedPark.description;
    detailActivities.textContent = selectedPark.activities.join(", ");
    detailWebsite.href = selectedPark.website;

    openDetailsDialog();
}

function refreshResults() {
    const parksForDisplay = getParksForDisplay();
    renderResults(parksForDisplay);
}

function handleCardActions(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
        return;
    }

    const parkId = button.dataset.parkId;
    if (!parkId) {
        return;
    }

    if (button.dataset.action === "details") {
        showParkDetails(parkId);
        return;
    }

    if (button.dataset.action === "save") {
        const selectedPark = allParks.find((park) => park.id === parkId);
        if (!selectedPark) {
            return;
        }

        const didAdd = addToPlan({
            id: selectedPark.id,
            fullName: selectedPark.fullName,
            states: selectedPark.states,
            designation: selectedPark.designation,
            imageUrl: selectedPark.imageUrl,
            imageAlt: selectedPark.imageAlt
        });

        if (didAdd) {
            button.textContent = "Saved";
            button.disabled = true;
        }
    }
}

function attachEvents() {
    searchInput.addEventListener("input", refreshResults);
    stateFilter.addEventListener("change", refreshResults);
    activityFilter.addEventListener("change", refreshResults);
    sortFilter.addEventListener("change", refreshResults);

    resetFiltersButton.addEventListener("click", () => {
        searchInput.value = "";
        stateFilter.value = "all";
        activityFilter.value = "all";
        sortFilter.value = "name";
        refreshResults();
    });

    parksContainer.addEventListener("click", handleCardActions);

    closeDialogButton.addEventListener("click", () => {
        closeDetailsDialog();
    });

    detailsDialog.addEventListener("click", (event) => {
        const clickedContent = event.target.closest(".modal-content");
        if (!clickedContent) {
            closeDetailsDialog();
        }
    });
}

async function initExplorePage() {
    try {
        dataStatus.textContent = "Loading parks.";
        allParks = await fetchParks();
        setFilterOptions(allParks);
        refreshResults();
        dataStatus.textContent = "";
    } catch {
        dataStatus.textContent = "Park data is unavailable right now.";
        resultsSummary.textContent = "Showing 0 parks.";
        parksContainer.innerHTML = "<p class=\"empty-state\">Park information is unavailable right now. Refresh the page to try again.</p>";
    }
}

attachEvents();
initExplorePage();
