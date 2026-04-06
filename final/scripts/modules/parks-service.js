const PARKS_DATA_URL = "./data/parks.json";
const NPS_API_URL = "https://developer.nps.gov/api/v1/parks";
const NPS_API_KEY = "NdpmlGMoN5Nqpe7KJW9gWthtMf4tn10MuePHTQbz";
const NPS_PAGE_SIZE = 500;

function isNationalParkDesignation(designation) {
    if (typeof designation !== "string") {
        return false;
    }

    const value = designation.trim().toLowerCase();
    const hasAllowedType = /(national park|lakeshore|recreation area|river|preserve)/.test(value);
    const hasExcludedType = /(monument|memorial|historic|historical|battlefield|parkway)/.test(value);

    return hasAllowedType && !hasExcludedType;
}

function toActivityNames(activities) {
    if (!Array.isArray(activities)) {
        return ["General Park Visit"];
    }

    const names = activities
        .map((activity) => activity?.name)
        .filter((name) => typeof name === "string" && name.trim().length > 0);

    return names.length > 0 ? names : ["General Park Visit"];
}

function normalizeNpsPark(park) {
    const firstImage = Array.isArray(park.images) && park.images.length > 0 ? park.images[0] : null;
    const imageUrl = firstImage?.url || "images/parks/national-park-default.jpg";
    const imageAlt = firstImage?.altText || `Scenic view from ${park.fullName || "a national park"}.`;

    return {
        id: park.parkCode || park.id,
        fullName: park.fullName || "Unnamed National Park",
        states: park.states || "N/A",
        designation: park.designation || "National Park",
        description: park.description || "Park details are not available for this listing.",
        imageUrl,
        imageAlt,
        activities: toActivityNames(park.activities),
        website: park.url || "https://www.nps.gov"
    };
}

async function fetchFromNpsApi() {
    const allParks = [];
    let start = 0;

    while (true) {
        const requestUrl = `${NPS_API_URL}?limit=${NPS_PAGE_SIZE}&start=${start}&api_key=${NPS_API_KEY}`;
        const response = await fetch(requestUrl);

        if (!response.ok) {
            throw new Error("NPS API request failed.");
        }

        const payload = await response.json();
        const parks = Array.isArray(payload.data) ? payload.data : [];

        allParks.push(...parks);

        if (parks.length < NPS_PAGE_SIZE) {
            break;
        }

        start += parks.length;
    }

    return allParks
        .filter((park) => isNationalParkDesignation(park.designation))
        .map((park) => normalizeNpsPark(park));
}

async function fetchFromLocalFile() {
    const response = await fetch(PARKS_DATA_URL);
    if (!response.ok) {
        throw new Error("Local park data request failed.");
    }

    const payload = await response.json();
    const parks = Array.isArray(payload.parks) ? payload.parks : [];
    return parks.filter((park) => isNationalParkDesignation(park.designation));
}

export async function fetchParks() {
    try {
        return await fetchFromNpsApi();
    } catch {
        return await fetchFromLocalFile();
    }
}
