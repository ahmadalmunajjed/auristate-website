// Single source of truth for homepage content. Client-supplied except where
// marked PLACEHOLDER.

export const nav = [
	{ label: 'About Us', href: '/about' },
	{ label: 'Projects', href: '/projects' },
	{ label: 'Our Services', href: '/services' },
	{ label: 'News', href: '/news' },
	{ label: 'Contact Us', href: '/contact' }
];

export const hero = {
	eyebrow: 'Tourism Investment',
	title: 'World-Class Destinations',
	body: 'Auristate Tourism Investment builds world-class destinations that embody elegance, opportunity, and cultural connection.',
	background: '/images/hero/hero-bg.svg',
	// null falls back to the poster alone — the hero never emits a <video> with
	// a dead source. AGENTS.md explains why the 480p source needs the tuning.
	showreel: '/videos/hero.mp4' as string | null,
	poster: '/images/hero/placeholder.png',
	showreelRate: 0.75,
	showreelStart: 2.4,
	ctas: [
		{ label: 'Explore Our Projects', href: '/projects', primary: true },
		{ label: 'Get in Touch', href: '/contact', primary: false }
	]
};

export const about = {
	eyebrow: 'About Us',
	title: 'Who We Are',
	lead: 'We are a Syrian joint-stock company specialized in real estate and tourism investments, founded in 2025. We combine deep local expertise with a renewed global vision.',
	paragraphs: [
		'We develop innovative projects that reflect authentic Syrian identity, while leveraging the latest global trends in design, construction, and building technologies.',
		'Our team brings together accumulated experience in the local market, supported by a wide international network, to offer the high-end investor a partner who understands their ambition and masters its execution.'
	]
};

export interface Project {
	name: string;
	/** Renders as the pill above the name. */
	tag: string;
	/** 16:9 or wider crops best. */
	image: string;
	/** '/projects/<slug>' once project pages exist. */
	href: string;
	/** Shown in the 1- and 4+-project layouts only. */
	summary?: string;
}

// `tag` values are inferred from the renders, not given by the client — THE
// MARK's gatehouse signage reads "luxury villas compound". Correct if wrong.
export const projects: Project[] = [
	{
		name: '365',
		tag: 'Hospitality / Venue',
		image: '/images/projects/365-photo.jpg',
		href: '/projects'
	},
	{
		name: 'Hameh',
		tag: 'Residential',
		image: '/images/projects/hameh.jpg',
		href: '/projects'
	},
	{
		name: 'THE MARK',
		tag: 'Luxury Villas Compound',
		image: '/images/projects/the-mark.jpg',
		href: '/projects'
	}
];

// PLACEHOLDER
export const cta = {
	title: "Ready to Invest in Syria's Future?",
	label: 'Contact Our Team',
	href: '/contact'
};

// PLACEHOLDER — email, phone, and address are invented. Replace before launch.
export const contact = {
	email: 'info@auristate.com',
	phone: '+963 00 000 0000',
	address: 'Damascus, Syria'
};

// PLACEHOLDER — these links point nowhere.
export const social = [
	{ label: 'LinkedIn', href: '#' },
	{ label: 'Instagram', href: '#' }
];

// PLACEHOLDER
export const footerTagline = 'Tourism & real estate investment across Syria.';
