/**
 * Date - Updates footer with current year and last modified date
 */
const currentYearElement = document.getElementById('currentyear');
const lastModifiedElement = document.getElementById('lastModified');

// Set current year in footer
if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}

// Set last modified date in footer
if (lastModifiedElement) {
  lastModifiedElement.textContent = `Last Modified: ${document.lastModified}`;
}
