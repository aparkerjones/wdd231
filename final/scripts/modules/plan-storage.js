const PLAN_STORAGE_KEY = "np-trails-plan";

function readPlan() {
    const rawValue = localStorage.getItem(PLAN_STORAGE_KEY);
    if (!rawValue) {
        return [];
    }

    try {
        const parsed = JSON.parse(rawValue);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writePlan(planItems) {
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(planItems));
}

export function getPlan() {
    return readPlan();
}

export function isInPlan(parkId) {
    return readPlan().some((park) => park.id === parkId);
}

export function addToPlan(park) {
    const currentPlan = readPlan();
    if (currentPlan.some((item) => item.id === park.id)) {
        return false;
    }

    const nextPlan = [...currentPlan, park];
    writePlan(nextPlan);
    return true;
}

export function removeFromPlan(parkId) {
    const nextPlan = readPlan().filter((park) => park.id !== parkId);
    writePlan(nextPlan);
}

export function clearPlan() {
    writePlan([]);
}
