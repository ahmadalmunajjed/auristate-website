// Single source of truth for homepage content.
// Section components import from here — they never hardcode copy.

export const nav = [
	{ label: 'About Us', href: '/about' },
	{ label: 'Projects', href: '/projects' },
	{ label: 'Our Services', href: '/services' },
	{ label: 'News', href: '/news' },
	{ label: 'Contact Us', href: '/contact' }
];

export const hero = {
	eyebrow: 'Tourism & Real Estate Investment',
	title: "Building Syria's Next Chapter",
	body: "Auristate identifies, develops, and manages premium tourism and real estate investments across Syria's coast, historic cities, and emerging regions.",
	background: '/images/hero/hero-bg.svg',
	// Client-supplied showreel: a 6.1s CGI walkthrough of the "365" venue.
	// Source is only 854x480 with an audible track we never play, so the hero
	// grades and slows it (see Hero.astro) rather than presenting it raw.
	// Set to null to fall back to the poster alone — the hero never emits a
	// <video> with a dead source.
	showreel: '/videos/hero.mp4' as string | null,
	// Frame lifted from the end of the clip (the wide, settled shot). The video
	// opens on a tighter framing, so Hero.astro crossfades in to hide the jump.
	poster: '/images/hero/placeholder.png',
	// Playback rate for the showreel. Slower reads as cinematic and gives the
	// encoder less frame-to-frame change, which softens the 480p blocking.
	showreelRate: 0.75,
	// Skip the opening seconds: the camera moves fastest there and the framing is
	// tightest, so it is by far the softest part of an already-480p clip. Playback
	// loops between this point and the end, where the shot is wide and settled.
	showreelStart: 2.4,
	ctas: [
		{ label: 'Explore Our Projects', href: '/projects', primary: true },
		{ label: 'Get in Touch', href: '/contact', primary: false }
	]
};

export const about = {
	eyebrow: 'About Auristate',
	title: "Unlocking Syria's Potential",
	paragraphs: [
		"Auristate is a tourism and real estate investment firm dedicated to unlocking Syria's potential — from coastal resorts to heritage restorations. We partner with investors and communities to build lasting value.",
		'Our work spans the full investment lifecycle: sourcing and appraising sites, structuring capital, managing development, and operating the assets once they open. Every project is underwritten with the same discipline, whether it is a seafront residence in Latakia or a courtyard house in Old Damascus.',
		'We build with the places we build in. Local craft, local materials, and local employment are part of the return we measure — because developments that a community is proud of are the ones that hold their value.'
	]
};

export const stats = [
	{ value: '12+', label: 'Years Regional Expertise' },
	{ value: '$150M+', label: 'Under Development' },
	{ value: '8', label: 'Active Projects' },
	{ value: '3', label: 'Cities' }
];

export const projects = [
	{
		name: 'Tartus Marina District',
		tag: 'Waterfront / Mixed-Use',
		image: '/images/projects/filler-1.svg',
		href: '/projects'
	},
	{
		name: 'Aleppo Souk Revival',
		tag: 'Heritage / Retail',
		image: '/images/projects/filler-2.svg',
		href: '/projects'
	},
	{
		name: 'Coastal Range Eco Lodges',
		tag: 'Hospitality / Eco-Tourism',
		image: '/images/projects/filler-3.svg',
		href: '/projects'
	}
];

// `icon` is a key the Services component maps to an inline SVG path.
export const services = [
	{
		icon: 'advisory',
		title: 'Investment Advisory',
		blurb:
			'Market appraisal, feasibility studies, and deal structuring for investors entering Syrian tourism and real estate.'
	},
	{
		icon: 'development',
		title: 'Property Development',
		blurb:
			'End-to-end delivery — site acquisition, design, permitting, and construction management on coastal and heritage sites.'
	},
	{
		icon: 'management',
		title: 'Asset & Property Management',
		blurb:
			'Leasing, maintenance, and performance reporting that protect yield across the full life of the asset.'
	},
	{
		icon: 'hospitality',
		title: 'Hospitality Operations',
		blurb:
			'Resort and hotel operations, from brand positioning and staffing to guest experience and revenue management.'
	}
];

export const posts = [
	{
		title: "Why Syria's Coastline Is Emerging for Tourism Investment",
		date: 'Jun 2026',
		excerpt:
			'Three hundred kilometres of Mediterranean shoreline, a reopening travel corridor, and a hospitality supply gap that has not been addressed in a generation.',
		href: '/news'
	},
	{
		title: 'A Guide to Real Estate Regulations for Foreign Investors',
		date: 'May 2026',
		excerpt: 'What ownership structures are available, and how to plan around them.',
		href: '/news'
	},
	{
		title: 'Inside Our Latest Development: Tartus Marina District',
		date: 'Apr 2026',
		excerpt: 'A walkthrough of the masterplan, the materials, and the delivery timeline.',
		href: '/news'
	}
];

export const visionMission = [
	{
		eyebrow: 'Our Vision',
		title: 'A Syria That Investors and Travellers Return To',
		body: 'To be the partner of record for tourism and real estate investment in Syria — restoring what is historic, building what is needed, and proving that responsible capital and cultural stewardship belong in the same project.'
	},
	{
		eyebrow: 'Our Mission',
		title: 'Develop With Discipline, Build With the Community',
		body: 'To source, structure, and deliver developments that hold their value: transparently underwritten, sensitively designed, locally staffed, and operated to a standard that stands comparison with any market in the region.'
	}
];

export const cta = {
	title: "Ready to Invest in Syria's Future?",
	label: 'Contact Our Team',
	href: '/contact'
};

export const contact = {
	email: 'info@auristate.com',
	phone: '+963 00 000 0000',
	address: 'Damascus, Syria'
};

export const social = [
	{ label: 'LinkedIn', href: '#' },
	{ label: 'Instagram', href: '#' }
];
