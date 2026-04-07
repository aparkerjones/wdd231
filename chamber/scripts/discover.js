import { attractions } from '../data/discover.mjs';

// Build discover cards
const grid = document.getElementById('discoverGrid');

attractions.forEach(item => {
	const card = document.createElement('article');
	card.classList.add('discover-card');
	card.classList.add(item.id);
	card.style.gridArea = item.id;

	const h2 = document.createElement('h2');
	h2.textContent = item.name;

	const figure = document.createElement('figure');
	const img = document.createElement('img');
	img.src = item.image;
	img.alt = item.alt;
	img.loading = 'lazy';
	img.width = 300;
	img.height = 200;
	figure.appendChild(img);

	const address = document.createElement('address');
	address.textContent = item.address;

	const p = document.createElement('p');
	p.textContent = item.description;

	const btn = document.createElement('button');
	btn.type = 'button';
	btn.classList.add('learn-more-btn');
	btn.textContent = 'Learn More';

	card.appendChild(h2);
	card.appendChild(figure);
	card.appendChild(address);
	card.appendChild(p);
	card.appendChild(btn);

	grid.appendChild(card);
});

// Visitor message using localStorage
const visitMsg = document.getElementById('visitMessage');
const lastVisit = localStorage.getItem('lastVisitDiscover');
const now = Date.now();

if (!lastVisit) {
	visitMsg.textContent = 'Welcome! Let us know if you have any questions.';
} else {
	const msPerDay = 1000 * 60 * 60 * 24;
	const daysDiff = Math.floor((now - Number(lastVisit)) / msPerDay);
	if (daysDiff < 1) {
		visitMsg.textContent = 'Back so soon! Awesome!';
	} else if (daysDiff === 1) {
		visitMsg.textContent = 'You last visited 1 day ago.';
	} else {
		visitMsg.textContent = `You last visited ${daysDiff} days ago.`;
	}
}

localStorage.setItem('lastVisitDiscover', now);
