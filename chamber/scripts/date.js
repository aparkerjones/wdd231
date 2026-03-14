const currentYearEl = document.getElementById("currentyear");
const lastModifiedEl = document.getElementById("lastModified");

// Set current year
if (currentYearEl) {
	currentYearEl.textContent = new Date().getFullYear();
}

// Set last modified
if (lastModifiedEl) {
	lastModifiedEl.textContent = `Last Modified: ${document.lastModified}`;
}
