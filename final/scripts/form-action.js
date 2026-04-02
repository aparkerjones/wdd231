const submittedDataElement = document.getElementById("submittedData");

const fieldLabels = {
    visitorName: "Name",
    visitorEmail: "Email",
    tripMonth: "Trip Month",
    parkInterest: "Park of Interest",
    groupSize: "Group Size",
    notes: "Trip Notes"
};

const params = new URLSearchParams(window.location.search);

const entries = Object.keys(fieldLabels)
    .map((key) => ({
        key,
        label: fieldLabels[key],
        value: params.get(key)
    }))
    .filter((item) => item.value && item.value.trim().length > 0);

if (entries.length === 0) {
    submittedDataElement.innerHTML = "<p class=\"empty-state\">No trip details are available yet.</p>";
} else {
    entries.forEach((item) => {
        const group = document.createElement("div");
        group.className = "submitted-item";

        const term = document.createElement("dt");
        term.textContent = item.label;

        const description = document.createElement("dd");
        description.textContent = item.value;

        group.append(term, description);
        submittedDataElement.append(group);
    });
}
