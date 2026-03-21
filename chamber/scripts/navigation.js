/**
 * Navigation - Mobile menu toggle
 * Toggles menu visibility and updates aria attributes for accessibility
 */
const menuToggleButton = document.getElementById('menuButton');
const primaryNavigation = document.getElementById('primaryNav');

if (menuToggleButton && primaryNavigation) {
  menuToggleButton.addEventListener('click', () => {
    const isMenuOpen = primaryNavigation.classList.toggle('open');
    menuToggleButton.setAttribute('aria-expanded', isMenuOpen.toString());
    menuToggleButton.setAttribute(
      'aria-label',
      isMenuOpen ? 'Close site navigation' : 'Open site navigation'
    );
    menuToggleButton.textContent = isMenuOpen ? '✕' : '☰';
  });
}
