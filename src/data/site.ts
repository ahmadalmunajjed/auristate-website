// Single source of truth for homepage content.
// Section components import from here — they never hardcode copy.
//
// Everything below is client-supplied except where marked PLACEHOLDER. Sections
// whose content has not arrived yet (Projects, Services, News, Vision & Mission)
// have no export here and are commented out of index.astro — a page that shows
// nothing beats a page that shows invented projects and fabricated articles.

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

// Client copy, verbatim. Split at sentence boundaries for the two-column layout;
// the only edit is "high end" -> "high-end".
export const about = {
	eyebrow: 'About Us',
	title: 'Who We Are',
	lead: 'We are a Syrian joint-stock company specialized in real estate and tourism investments, founded in 2025. We combine deep local expertise with a renewed global vision.',
	paragraphs: [
		'We develop innovative projects that reflect authentic Syrian identity, while leveraging the latest global trends in design, construction, and building technologies.',
		'Our team brings together accumulated experience in the local market, supported by a wide international network, to offer the high-end investor a partner who understands their ambition and masters its execution.'
	]
};

// PLACEHOLDER — not client copy. Makes no factual claim, so it ships, but it
// should be replaced when the client sends closing copy.
export const cta = {
	title: "Ready to Invest in Syria's Future?",
	label: 'Contact Our Team',
	href: '/contact'
};

// PLACEHOLDER — the email, phone, and address are all invented. Replace before
// launch; a wrong phone number is worse than none.
export const contact = {
	email: 'info@auristate.com',
	phone: '+963 00 000 0000',
	address: 'Damascus, Syria'
};

// PLACEHOLDER — real profile URLs needed; these point nowhere.
export const social = [
	{ label: 'LinkedIn', href: '#' },
	{ label: 'Instagram', href: '#' }
];

// PLACEHOLDER — footer tagline, not client copy.
export const footerTagline = 'Tourism & real estate investment across Syria.';
