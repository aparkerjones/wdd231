const menuToggleButton = document.getElementById("menuButton");
const primaryNavigation = document.getElementById("primaryNav");

// Keep this tiny: one click toggles menu visibility and accessible state.
if (menuToggleButton && primaryNavigation) {
    menuToggleButton.addEventListener("click", () => {
        const isMenuOpen = primaryNavigation.classList.toggle("open");
        menuToggleButton.setAttribute("aria-expanded", isMenuOpen.toString());
        menuToggleButton.setAttribute("aria-label", isMenuOpen ? "Close site navigation" : "Open site navigation");
        menuToggleButton.textContent = isMenuOpen ? "✕" : "☰";
    });
}
