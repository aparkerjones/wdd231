const currentYearElement = document.getElementById("currentyear");
const lastModifiedElement = document.getElementById("lastModified");

// Show the current year so the footer stays up to date automatically.
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Browser gives us the page timestamp as a readable string.
if (lastModifiedElement) {
    lastModifiedElement.textContent = `Last Modified: ${document.lastModified}`;
}
