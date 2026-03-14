// Page elements
const memberContainer = document.getElementById("memberCards");
const gridBtn = document.getElementById("gridView");
const listBtn = document.getElementById("listView");

// Membership labels
const MEMBERSHIP_LABELS = {
	1: "Non-Profit",
	2: "Silver",
	3: "Gold"
};

// Load members
async function fetchMembers() {
	try {
		const response = await fetch("data/members.json");
		if (!response.ok) {
			throw new Error(`HTTP error ${response.status}`);
		}
		const members = await response.json();
		displayMembers(members);
	} catch (error) {
		// Show a fallback message
		memberContainer.innerHTML =
			`<p class="load-error">Unable to load member data. Please try again later.</p>`;
		console.error("Failed to fetch members:", error);
	}
}

// Render cards
function displayMembers(members) {
	memberContainer.innerHTML = members
		.map(member => `
		<article class="member-card">
			<img
				src="${member.image}"
				alt="${member.name} logo"
				loading="lazy"
				width="200"
				height="130"
				onerror="this.style.display='none'"
			>
			<h3>${member.name}</h3>
			<p class="member-address">${member.address}</p>
			<p class="member-phone">${member.phone}</p>
			<a href="${member.website}" target="_blank" rel="noopener noreferrer">
				${member.website.replace(/^https?:\/\//, "")}
			</a>
			${member.description ? `<p class="member-desc">${member.description}</p>` : ""}
			<span class="membership-badge level-${member.membershipLevel}">
				${MEMBERSHIP_LABELS[member.membershipLevel] ?? "Member"}
			</span>
		</article>
	`).join("");
}

// Toggle layout
function setView(view) {
	const isGrid = view === "grid";

	// Swap layout classes
	memberContainer.classList.toggle("grid-view", isGrid);
	memberContainer.classList.toggle("list-view", !isGrid);

	// Update button styles
	gridBtn.classList.toggle("active", isGrid);
	listBtn.classList.toggle("active", !isGrid);

	// Update aria state
	gridBtn.setAttribute("aria-pressed", String(isGrid));
	listBtn.setAttribute("aria-pressed", String(!isGrid));
}

// View buttons
if (gridBtn && listBtn) {
	gridBtn.addEventListener("click", () => setView("grid"));
	listBtn.addEventListener("click", () => setView("list"));
}

// Start page
fetchMembers();
