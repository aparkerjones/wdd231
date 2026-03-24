/**
 * Thank You Page - Display submitted form data
 */

document.addEventListener('DOMContentLoaded', function() {
    displayFormData();
});

/**
 * Show submitted form data
 */
function displayFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const summaryContent = document.getElementById('summary-content');

    // Fields to show
    const requiredFields = [
        { key: 'fname', label: 'First Name' },
        { key: 'lname', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Mobile Phone' },
        { key: 'organization', label: 'Business/Organization Name' },
        { key: 'timestamp', label: 'Application Date & Time' }
    ];

    let summaryHTML = '<dl class="summary-list">';

    requiredFields.forEach(field => {
        const value = urlParams.get(field.key);
        if (value) {
            let displayValue = value;

            // Format the date/time
            if (field.key === 'timestamp') {
                const date = new Date(value);
                displayValue = date.toLocaleString();
            }

            summaryHTML += `
                <div class="summary-item">
                    <dt>${field.label}:</dt>
                    <dd>${displayValue}</dd>
                </div>
            `;
        }
    });

    summaryHTML += '</dl>';

    // Include membership level
    const membership = urlParams.get('membership');
    if (membership) {
        const membershipLabels = {
            'np': 'NP Membership (Non-Profit)',
            'bronze': 'Bronze Membership',
            'silver': 'Silver Membership',
            'gold': 'Gold Membership'
        };
        summaryHTML += `
            <div class="summary-item">
                <dt>Membership Level:</dt>
                <dd>${membershipLabels[membership] || membership}</dd>
            </div>
        `;
    }

    summaryContent.innerHTML = summaryHTML;
}