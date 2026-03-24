# National Parks Guide - My Project Notes

## Project Overview
Building a 3-page site about U.S. national parks. Use NPS API for data. Responsive, accessible, no frameworks. Host in "final" folder on GitHub Pages.

## Pages to Build
- **index.html (Home)**: Landing page. Highlight featured parks with overviews, images, links.
- **Directory Page**: List parks by state. Add search/filter.
- **Activities Page**: Focus on trails, events, activities.

## Requirements Checklist
- **HTML**: Semantic elements (header, nav, main, footer). Valid markup. Unique titles/meta tags per page. Open Graph for sharing. Park-themed favicon.
- **CSS**: Responsive (320px+ mobile, desktop). Hamburger nav. Design principles (proximity, alignment, etc.). Accessibility (contrast). <500KB pages. Optimize images.
- **JS Features**:
  - Fetch API from NPS API (/parks endpoint). Use try...catch for errors. Parse JSON.
  - Display 15+ parks per page, 4+ properties each (name, state, desc, image).
  - Local storage for favorites/itineraries.
  - At least 1 modal for park details.
  - DOM: Select elements, modify styles/content, event listeners (click, submit, change).
  - Array methods: map/filter for data processing.
  - Template literals for dynamic HTML.
  - ES modules for organization.
- **Form**: HTML form (e.g., contact/search) with action page (not counted in 3 pages).
- **Images**: From API, lazy load, intrinsic ratios.
- **Professional**: Proofread. Attributions page in footer. 3-5 min video demo (API + async).
- **Testing**: Audit tool, DevTools (errors, contrast, Lighthouse), multi-browser/device. Video in footer.

## API Details
- Source: NPS API (free).
- Endpoints: /parks (data), /activities (events).
- Properties: id, fullName, states, description, images[], activities, etc.
- Fallback: Local JSON if needed.

## Tech Stack
- HTML/CSS/JS only.
- ES6+.
- Grid/Flexbox for responsive.

## Reminders
- Update nav "Final" link to point here.
- Get API key if required (check NPS docs).
- Test on mobile first.
- Video: Show fetch with try...catch.