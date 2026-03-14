// Mobile menu
const menuToggleButton = document.getElementById("menuButton");
const primaryNavigation = document.getElementById("primaryNav");

if (menuToggleButton && primaryNavigation) {
	menuToggleButton.addEventListener("click", () => {
		const isMenuOpen = primaryNavigation.classList.toggle("open");
		// Update aria state
		menuToggleButton.setAttribute("aria-expanded", isMenuOpen.toString());
		menuToggleButton.setAttribute(
			"aria-label",
			isMenuOpen ? "Close site navigation" : "Open site navigation"
		);
		// Update icon
		menuToggleButton.textContent = isMenuOpen ? "\u2715" : "\u2630";
	});
}
