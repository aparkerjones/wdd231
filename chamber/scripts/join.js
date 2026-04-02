/**
 * Join Page - Form handling, modals, and animations
 */

// Set form timestamp on load
document.addEventListener('DOMContentLoaded', function() {
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    // Set up modal dialogs
    initializeModals();

    // Start card animations
    animateCards();
});

/**
 * Set up modal functionality
 */
function initializeModals() {
    const modalLinks = document.querySelectorAll('.level-link');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    // Open dialog on link click
    modalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal && typeof modal.showModal === 'function') {
                modal.showModal();
            }
        });
    });

    // Close dialog on button click
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal && modal.open) {
                modal.close();
            }
        });
    });

    // Close dialog when clicking the backdrop area
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            const rect = modal.getBoundingClientRect();
            const clickedOutside =
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom;

            if (clickedOutside && modal.open) {
                modal.close();
            }
        });
    });
}

/**
 * Animate membership level cards on load
 */
function animateCards() {
    const cards = document.querySelectorAll('.level-card');

    cards.forEach((card, index) => {
        // Start cards hidden and offset
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        // Animate in with delay
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200); // Stagger by 200ms
    });
}